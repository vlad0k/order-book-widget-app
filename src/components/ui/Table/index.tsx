import React, { CSSProperties, ReactNode, useMemo } from "react";
import classes from "./styles.module.css";

export interface ITableConfig<T = Record<string, number | string>> {
  field: keyof T;
  title: string;
  renderCell?: (value: T[keyof T]) => ReactNode;
  cellStyle?: CSSProperties;
}

interface IOrderBookTableBaseProps<T extends Record<string, number | string>> {
  data: T[];
  config: ITableConfig<T>[];
  getRowId?: (d: T) => string | number;
}

const Table = <T extends Record<string, number | string>>({
  config,
  data,
  getRowId,
}: IOrderBookTableBaseProps<T>) => {
  const tableHeadRows = useMemo(
    () => (
      <tr>
        {config.map(({ field, title, cellStyle }) => (
          <td key={field.toString()} className={classes.cell} style={cellStyle}>
            {title}
          </td>
        ))}
      </tr>
    ),
    [config]
  );

  const tableRows = useMemo(
    () => (
      <>
        {data.map((d) => (
          <tr key={getRowId?.(d) || d?.id}>
            {config.map(({ field, renderCell, cellStyle }) => (
              <td
                key={field.toString()}
                className={classes.cell}
                style={cellStyle}
              >
                {renderCell?.(d[field]) || d[field]}
              </td>
            ))}
          </tr>
        ))}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, data]
  );

  return (
    <div>
      <table className={classes.table}>
        <thead>{tableHeadRows}</thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
};

export default Table;
