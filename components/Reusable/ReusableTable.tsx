import React from "react";

interface ReusableTableColumn {
  label: string;
  key: string;
  headerClassName?: string;
  cellClassName?: string;
}

type TableRow = Record<string, unknown>;

interface ReusableTableProps {
  columns: ReusableTableColumn[];
  data: TableRow[];
  rowKey?: string;
  emptyMessage?: React.ReactNode;
  showSortIndicator?: boolean;
  containerClassName?: string;
  tableClassName?: string;
  rowClassName?: string;
  renderCell?: (
    row: TableRow,
    value: unknown,
    col: ReusableTableColumn
  ) => React.ReactNode;
}

const joinClasses = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  rowKey = "id",
  emptyMessage = "No data found.",
  showSortIndicator = false,
  containerClassName,
  tableClassName,
  rowClassName,
  renderCell,
}) => {
  const getRowKey = (row: TableRow, rowIndex: number) => {
    const value = row[rowKey];
    return typeof value === "string" || typeof value === "number"
      ? value
      : rowIndex;
  };

  const displayValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return String(value);
  };

  return (
    <div
      className={joinClasses(
        "overflow-x-auto",
        containerClassName
      )}
    >
      <table
        className={joinClasses(
          "min-w-245 w-full border-separate border-spacing-0",
          tableClassName
        )}
      >
        <thead>
          <tr className="text-nowrap">
            {columns.map((col) => (
              <th
                key={col.key}
                className={joinClasses(
                  "bg-[#202020] px-5 py-4.25 text-left text-sm font-medium text-[#F3F3F3] ",
                  col.headerClassName
                )}
              >
                {showSortIndicator ? (
                  <span className="flex items-center justify-between gap-3">
                    <span>{col.label}</span>
                    <span className="sort-indicator" aria-hidden="true">
                      <span className="sort-indicator__up" />
                      <span className="sort-indicator__down" />
                    </span>
                  </span>
                ) : (
                  <span>{col.label}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center text-sm text-[#A0A0A0]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className={joinClasses(
                  "text-nowrap text-white hover:bg-white/2 last:[&>td]:border-b-0",
                  rowClassName
                )}
              >
                {columns.map((col) => (
                  <td
                    key={`${col.key}-${rowIndex}`}
                    className={joinClasses(
                      "border-b border-white/8 px-5 py-4.5 text-sm text-[#E7E7E7]",
                      col.cellClassName
                    )}
                  >
                    {renderCell
                      ? renderCell(row, row[col.key], col)
                      : displayValue(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
