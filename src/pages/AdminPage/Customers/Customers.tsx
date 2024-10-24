import React, { useState } from "react";
import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./CustomerList.module.scss";
import classNames from "classnames/bind";
import Search from "../../../components/Search/Search";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { useNavigate } from "react-router-dom";
import { Customer } from "../../../types/hotel";

const cx = classNames.bind(styles);

// Định nghĩa các cột cho DataGrid
const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span style={{ paddingLeft: "10px" }}>ID</span>,
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>{params.row.id}</span>
    ),
  },
  {
    field: "name",
    headerName: "Tên",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tên</span>,
    renderCell: (params) => <span>{params.row.name}</span>,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Email</span>,
    renderCell: (params) => <span>{params.row.email}</span>,
  },
  {
    field: "phoneNumber",
    headerName: "Số điện thoại",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số điện thoại</span>,
    renderCell: (params) => <span>{params.row.phoneNumber}</span>,
  },
  {
    field: "nationality",
    headerName: "Quốc tịch",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Quốc tịch</span>,
    renderCell: (params) => <span>{params.row.nationality}</span>,
  },
  {
    field: "gender",
    headerName: "Giới tính",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giới tính</span>,
    renderCell: (params) => <span>{params.row.gender}</span>,
  },
  {
    field: "dateOfBirth",
    headerName: "Ngày sinh",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Ngày sinh</span>,
    renderCell: (params) => (
      <span>{new Date(params.row.dateOfBirth).toLocaleDateString()}</span>
    ),
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Địa chỉ</span>,
    renderCell: (params) => <span>{params.row.address}</span>,
  },
  {
    field: "notes",
    headerName: "Ghi chú",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Ghi chú</span>,
    renderCell: (params) => <span>{params.row.notes}</span>,
  },
  {
    field: "identityNumber",
    headerName: "Số chứng minh thư",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số chứng minh thư</span>,
    renderCell: (params) => <span>{params.row.identityNumber}</span>,
  },
];

// Dữ liệu giả lập
const data: Customer[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    nationality: "Việt Nam",
    phoneNumber: "0123456789",
    address: "Hà Nội, Việt Nam",
    dateOfBirth: 631152000000, // UNIX timestamp
    gender: "Nam",
    notes: "Khách quen.",
    identityNumber: "123456789",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    nationality: "Việt Nam",
    phoneNumber: "0987654321",
    address: "TP. Hồ Chí Minh, Việt Nam",
    dateOfBirth: 568464000000,
    gender: "Nữ",
    notes: "Mới đến.",
    identityNumber: "987654321",
  },
];

const Customers = () => {
  const navigate = useNavigate();

  const handleAddCustomer = () => {
    // navigate("/admin/" + ADMIN_PATHS.CUSTOMER_CREATE);
  };

  const handleSearch = (input: any) => {
    console.log(input);
  };

  return (
    <Container
      fullscreen
      title="Danh sách khách hàng"
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Thêm khách hàng"
          onClick={handleAddCustomer}
        />
      }
      linkToBack="/admin"
      titleToBack="Quay trở lại trang admin"
    >
      <div className={cx("customer-list-box")}>
        <div className={cx("search")}>
          <Search placeholder="Tìm kiếm khách hàng" onSearch={handleSearch} />
        </div>
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem", cursor: "pointer" }}
            className={cx("data")}
            rows={data}
            columns={columns}
            rowCount={data.length}
            disableColumnSorting={true}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default Customers;
