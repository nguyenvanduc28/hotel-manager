import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

interface ColumnFilterProps {
  hiddenColumns: GridColDef[]; // Danh sách các cột có thể ẩn/hiển
  defaultVisibleColumns: GridColDef[]; // Các cột hiển thị mặc định
  onChange: (columns: GridColDef[]) => void; // Hàm callback để trả về các cột sau khi cập nhật
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  hiddenColumns,
  defaultVisibleColumns,
  onChange,
}) => {
  const [visibleColumns, setVisibleColumns] = useState<GridColDef[]>(defaultVisibleColumns);

  // Hàm toggle quản lý logic hiển thị cột
  const handleToggleColumn = (column: GridColDef) => {
    const updatedColumns = visibleColumns.some((col) => col.field === column.field)
      ? visibleColumns.filter((col) => col.field !== column.field)
      : [...visibleColumns, column];

    setVisibleColumns(updatedColumns);
    onChange(updatedColumns);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      {hiddenColumns.map((col) => (
        <FormControlLabel
          key={col.field}
          control={
            <Checkbox
              checked={visibleColumns.some((vc) => vc.field === col.field)}
              onChange={() => handleToggleColumn(col)}
            />
          }
          label={col.headerName}
        />
      ))}
    </div>
  );
};

export default ColumnFilter;
