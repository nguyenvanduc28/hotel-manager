import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import styles from "./RoomType.module.scss";
import classNames from "classnames/bind";
import Search from "../../../components/Search/Search";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>ID</span>,
    renderCell: (params) => <span>{params ? params.row.id : ""}</span>,
  },
  {
    field: "name",
    headerName: "Tên phòng",
    flex: 3,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tên phòng</span>,
    renderCell: (params) => <span>{params ? params.row.name : ""}</span>,
  },
  {
    field: "description",
    headerName: "Mô tả",
    flex: 4,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Mô tả</span>,
    renderCell: (params) => <span>{params ? params.row.description : ""}</span>,
  },
  {
    field: "single_bed_count",
    headerName: "Giường đơn",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giường đơn</span>,
    renderCell: (params) => (
      <span>{params ? params.row.single_bed_count : ""}</span>
    ),
  },
  {
    field: "double_bed_count",
    headerName: "Giường đôi",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giường đôi</span>,
    renderCell: (params) => (
      <span>{params ? params.row.double_bed_count : ""}</span>
    ),
  },
  {
    field: "extra_bed_available",
    headerName: "Giường phụ",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giường phụ</span>,
    renderCell: (params) => (
      <span>
        {params ? (params.row.extra_bed_available ? "Có" : "Không") : ""}
      </span>
    ),
  },
  {
    field: "size",
    headerName: "Diện tích (m²)",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Diện tích (m²)</span>,
    renderCell: (params) => <span>{params ? params.row.size : ""}</span>,
  },
  {
    field: "max_occupancy",
    headerName: "Số người tối đa",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số người tối đa</span>,
    renderCell: (params) => (
      <span>{params ? params.row.max_occupancy : ""}</span>
    ),
  },
  {
    field: "base_price_per_night",
    headerName: "Giá cơ bản / đêm",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giá cơ bản / đêm</span>,
    renderCell: (params) => (
      <span>{params ? params.row.base_price_per_night : ""}</span>
    ),
  },
];

const data = [
  {
    id: 1,
    name: "Phòng tiêu chuẩn",
    description: "Phòng tiêu chuẩn có đầy đủ tiện nghi.",
    single_bed_count: 1,
    double_bed_count: 1,
    extra_bed_available: true,
    size: 25,
    max_occupancy: 3,
    base_price_per_night: 500000,
  },
  {
    id: 2,
    name: "Phòng Deluxe",
    description: "Phòng rộng rãi với tầm nhìn đẹp.",
    single_bed_count: 0,
    double_bed_count: 2,
    extra_bed_available: true,
    size: 35,
    max_occupancy: 4,
    base_price_per_night: 800000,
  },
  // Thêm nhiều phòng khác vào đây
];

const RoomType = () => {
  const navigate = useNavigate();
  const handleAddRoomType = () => {
    navigate("/admin/" + ADMIN_PATHS.ROOM_TYPE_CREATE);
  };
  const handleSearch = (input: any) => {
    console.log(input);
  };
  const handleRowClick = (e: any) => {
    console.log(e);
  };
  return (
    <Container
      fullscreen
      title="Danh sách loại phòng"
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Thêm loại phòng"
          onClick={handleAddRoomType}
        />
      }
      linkToBack="/admin"
      titleToBack="Quay trở lại trang admin"
    >
      <div className={cx("room-type-box")}>
        <div className={cx("search")}>
          <Search placeholder="Tìm kiếm loại phòng" onSearch={handleSearch} />
        </div>
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem" }}
            className={cx("data")}
            rows={data}
            columns={columns}
            rowCount={data.length}
            disableColumnSorting={true}
            onRowClick={handleRowClick}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default RoomType;
