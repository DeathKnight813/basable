use std::net::SocketAddr;

use axum::extract::connect_info::IntoMakeServiceWithConnectInfo;
use axum::http::HeaderName;
use axum::{
    async_trait,
    extract::{FromRef, FromRequestParts, MatchedPath, Request},
    http::{
        header::{ACCEPT, ACCESS_CONTROL_ALLOW_HEADERS, CONTENT_TYPE},
        request::Parts,
        HeaderValue, StatusCode,
    },
    Router,
};

use tower::ServiceBuilder;
use tower_http::cors::Any;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::base::AppState;
use crate::AppError;

use super::routes::core_routes;

type BasableHttpService = IntoMakeServiceWithConnectInfo<Router<()>, std::net::SocketAddr>;

#[async_trait]
impl<S> FromRequestParts<S> for AppState
where
    Self: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = (StatusCode, &'static str);

    async fn from_request_parts(_parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        Ok(Self::from_ref(state))
    }
}

pub fn app() -> Result<BasableHttpService, AppError> {
    // We add CORS middleware to enable connection from Vue/React Development client
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
        .allow_headers([
            ACCEPT,
            ACCESS_CONTROL_ALLOW_HEADERS,
            CONTENT_TYPE,
            HeaderName::from_static("session-id"),
            HeaderName::from_static("connection-id"),
        ])
        .allow_methods(Any);

    let state = AppState::default();
    state.local_db.setup()?;

    let routes = core_routes();

    let r = Router::new()
        .nest("/core", routes)
        .layer(
            ServiceBuilder::new()
                .layer(
                    TraceLayer::new_for_http()
                        .make_span_with(|req: &Request| {
                            let method = req.method();
                            let uri = req.uri();

                            let matched_path = req
                                .extensions()
                                .get::<MatchedPath>()
                                .map(|matched_path| matched_path.as_str());

                            tracing::debug_span!("request", %method, %uri, matched_path)
                        })
                        .on_failure(()),
                )
                .layer(cors),
        )
        .with_state(state)
        .into_make_service_with_connect_info::<SocketAddr>();

    Ok(r)
}
