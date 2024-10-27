import React, { useEffect, useState } from "react";
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
import { getCustomers } from "../../../apis/bookingApis/bookingApis";

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
    field: "birthDay",
    headerName: "Ngày sinh",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Ngày sinh</span>,
    renderCell: (params) => {
      const date = new Date(params ? params.row.birthDay : 0);
      return (
        <span>
          {params ? date.toLocaleString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }) : ""}
        </span>
      );
    },
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
const Customers = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await getCustomers();
        setData(customers);
      } catch (error) {
        console.error("Lấy danh sách khách hàng thất bại:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    navigate("/admin/" + ADMIN_PATHS.CUSTOMER_CREATE);
  };

  const handleSearch = (input: string) => {
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
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
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
          )}
        </div>
      </div>
    </Container>
  );
};

export default Customers;
