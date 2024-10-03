import * as React from "react";
import { ListItemText } from "@material-ui/core";
import ToolBar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";
import { ListSubheader } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import Avatar from "../../assets/images/Avater.png";
import database1 from "../../assets/images/database1.svg";
import database2 from "../../assets/images/database2.svg";
import database3 from "../../assets/images/database3.svg";
import database4 from "../../assets/images/database4.svg";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DashboardIcon } from "./icons/DashboardIcon";
import { TablesIcon } from "./icons/TablesIcon";
import { VisualizationIcon } from "./icons/VisualizationIcon";
import { HelpIcon } from "./icons/HelpIcon";
import { LogoutIcon } from "./icons/LogoutIcon";
import { NavItem } from "./NavItem";
import { useStore } from "../../utils";

const drawerWidth = 240;

function DashboardNav({ showMobileSidebar = false }) {
  const [openTables, setOpenTables] = React.useState(true);
  const tables = useStore(state => state.tables)
  const tableItems = tables.map(t => t.name)

  const handleTablesClick = () => {
    setOpenTables(!openTables);
  };

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: {
            xs: showMobileSidebar ? 'flex' : 'none',
            md: 'flex'
          },
        }}
      >
        <ToolBar sx={{ height: "100px" }}></ToolBar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
            padding: "20px",
            height: "calc(100% - 100px)",
          }}
        >
          <div className="main-container">
            <ListItem>
              <div style={{ paddingRight: "10px" }}>
                <img src={Avatar} alt="avatar" />
              </div>
              <ListItemText
                primary={
                  <strong
                    style={{
                      fontWeight: "700",
                      fontFamily: '"Exo", sans-serif',
                    }}
                  >
                    Stefania Asuqo
                  </strong>
                }
                secondary={
                  <span
                    style={{
                      display: "inline-flex",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      backgroundColor: "red",
                      borderRadius: "5px",
                      color: "white",
                      fontFamily: '"Exo", sans-serif',
                    }}
                  >
                    Developer
                  </span>
                }
              />
            </ListItem>
            <ListItem
              sx={{ paddingLeft: "0px", fontFamily: '"Exo", sans-serif' }}
            >
              <Box>
                <FormControl fullWidth>
                  <Select
                    defaultValue={10}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiInputBase-input": {
                        fontFamily: '"Exo", sans-serif',
                        display: "flex",
                      },
                    }}
                  >
                    <ListSubheader>
                      <strong style={{ fontFamily: '"Exo", sans-serif' }}>
                        Connected Database
                      </strong>
                    </ListSubheader>
                    <Box
                      sx={{ paddingX: "15px", fontFamily: '"Exo", sans-serif' }}
                    >
                      <Divider />
                    </Box>
                    <MenuItem
                      value={10}
                      sx={{ fontFamily: '"Exo", sans-serif' }}
                    >
                      <img
                        src={database1}
                        alt=""
                        style={{ paddingRight: "5px" }}
                      />
                      Basable Database
                    </MenuItem>
                    <MenuItem value={20}>
                      <img
                        src={database2}
                        alt=""
                        style={{ paddingRight: "5px" }}
                      />
                      Jumia Database
                    </MenuItem>
                    <MenuItem value={30}>
                      <img
                        src={database3}
                        alt=""
                        style={{ paddingRight: "5px" }}
                      />
                      Whatsapp Database
                    </MenuItem>
                    <MenuItem value={40}>
                      <img
                        src={database4}
                        alt=""
                        style={{ paddingRight: "5px" }}
                      />
                      Instagram Database
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </ListItem>
            <Divider />
            <NavItem
              label="Dashboard"
              icon={<DashboardIcon color="#4451CA" />}
              selected
            />
            <NavItem
              label="Tables"
              icon={<TablesIcon />}
              expandable
              expanded={openTables}
              onClick={handleTablesClick}
              tableList={tableItems}
            />

            <NavItem label="Visualization" icon={<VisualizationIcon />} />
          </div>
          <div className="bottom-container">
            <NavItem label="LogOut" icon={<LogoutIcon />} />
            <NavItem label="Help" icon={<HelpIcon />} />
          </div>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}

export default DashboardNav;
