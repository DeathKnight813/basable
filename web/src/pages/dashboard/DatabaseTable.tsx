import * as React from "react";
import { useParams } from "react-router-dom";
import { useNetworkRequest, TableColumn, TableRow } from "../../utils";

const DatabaseTable = () => {
  const request = useNetworkRequest();
  const { tableID } = useParams();

  const [columns, setColumns] = React.useState<TableColumn[]>([]);
  const [rows, setRows] = React.useState<TableRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const getColumnValue = (name: string, row: TableRow) => {
    const o = row[name];
    const k = Object.keys(row[name])[0];
    return o[k] as string;
  };

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const cols: TableColumn[] = await request({
        method: "get",
        path: "tables/columns/" + tableID,
      });
      setColumns(cols);

      const rows: TableRow[] = await request({
        method: "get",
        path: "tables/data/" + tableID,
      });
      setRows(rows);
      setLoading(false);
    };

    if (tableID) loadData();
  }, [request, tableID]);

  if (loading) return <div>Loading</div>;

  return (
    <section className="displayTable dashboardDisplay">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.name}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="editableRow" key={index}>
              {columns.map((col) => (
                <td key={col.name}>
                  {
                    <input
                      value={getColumnValue(col.name, row)}
                      onChange={() => {}}
                    />
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default DatabaseTable;