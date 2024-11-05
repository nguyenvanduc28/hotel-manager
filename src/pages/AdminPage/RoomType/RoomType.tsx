import { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./RoomType.module.scss";
import classNames from "classnames/bind";
import Search from "../../../components/Search/Search";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { useNavigate } from "react-router-dom";
import { getRoomTypes } from "../../../apis/roomApis/roomApis";

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
    field: "singleBedCount",
    headerName: "Giường đơn",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giường đơn</span>,
    renderCell: (params) => (
      <span>{params ? params.row.singleBedCount : ""}</span>
    ),
  },
  {
    field: "doubleBedCount",
    headerName: "Giường đôi",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giường đôi</span>,
    renderCell: (params) => (
      <span>{params ? params.row.doubleBedCount : ""}</span>
    ),
  },
  {
    field: "extrabedavailable",
    headerName: "Giường phụ",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giường phụ</span>,
    renderCell: (params) => (
      <span>
        {params ? (params.row.extrabedavailable ? "Có" : "Không") : ""}
      </span>
    ),
  },
  {
    field: "sizeRange",
    headerName: "Diện tích (m²)",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Diện tích (m²)</span>,
    renderCell: (params) => <span>{params ? params.row.sizeRange : ""}</span>,
  },
  {
    field: "maxOccupancy",
    headerName: "Số người tối đa",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số người tối đa</span>,
    renderCell: (params) => (
      <span>{params ? params.row.maxOccupancy : ""}</span>
    ),
  },
  {
    field: "basePricePerNight",
    headerName: "Giá cơ bản / đêm",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giá cơ bản / đêm</span>,
    renderCell: (params) => (
      <span>{params ? params.row.basePricePerNight.toLocaleString() : "0"} đ</span>
    ),
  },
];

const RoomType = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const roomTypes = await getRoomTypes();
        setData(roomTypes);
      } catch (error) {
        console.error("Failed to fetch room types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

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
          <Search placeholder="Tìm kiếm loại phòng" handleSearch={(q) => handleSearch(q)} />
        </div>
        <div className={cx("list")}>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
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
          )}
        </div>
      </div>
    </Container>
  );
};

export default RoomType;
