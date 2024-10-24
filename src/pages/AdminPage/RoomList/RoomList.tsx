import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./RoomList.module.scss";
import classNames from "classnames/bind";
import Search from "../../../components/Search/Search";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { useNavigate } from "react-router-dom";
import { StyledChip } from "../../../components/StyledChip/StyledChip";
import { RoomInfo } from "../../../types/hotel";
import {
  AMENITY_CATEGORY,
  AMENITY_STATUS,
  ROOM_STATUS,
} from "../../../constants/admin/constants";
import { useState } from "react";
import ShowInfoDialog from "../../../components/ShowInfoDialog/ShowInfoDialog";
const cx = classNames.bind(styles);

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
    field: "roomNumber",
    headerName: "Số phòng",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số phòng</span>,
    renderCell: (params) => <span>{params.row.roomNumber}</span>,
  },
  {
    field: "floor",
    headerName: "Tầng",
    flex: 0.5,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tầng</span>,
    renderCell: (params) => <span>{params.row.floor}</span>,
  },
  {
    field: "roomType",
    headerName: "Loại phòng",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Loại phòng</span>,
    renderCell: (params) => (
      <span>{params.row.roomType ? params.row.roomType.name : ""}</span>
    ),
  },
  {
    field: "currentStatus",
    headerName: "Trạng thái",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Trạng thái</span>,
    renderCell: (params) => (
      <StyledChip
        label={params.row.currentStatus}
        color={params.row.currentStatus === ROOM_STATUS.AVAILABLE ? "success" : "error"}
      />
    ),
  },
  {
    field: "isAvailable",
    headerName: "Có sẵn",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Có sẵn</span>,
    renderCell: (params) => (
      <StyledChip
        label={params.row.isAvailable ? "Có" : "Không"}
        color={params.row.isAvailable ? "success" : "error"}
      />
    ),
  },
  {
    field: "lastCleaned",
    headerName: "Lần dọn dẹp",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Dọn dẹp lần cuối</span>,
    renderCell: (params) => <span>{new Date(params.row.lastCleaned).toLocaleDateString()}</span>,
  },
];

const data: RoomInfo[] = [
  {
    id: 1,
    roomNumber: 101,
    floor: 1,
    isAvailable: true,
    currentStatus: ROOM_STATUS.AVAILABLE,
    description: "Phòng đôi với view biển.",
    isSmokingAllowed: false,
    lastCleaned: 1697884800000, // UNIX timestamp
    roomType: {
      id: 1,
      name: "Deluxe Room",
      description: "Phòng rộng rãi với tiện nghi hiện đại.",
      singleBedCount: 1,
      doubleBedCount: 1,
      extraBedAvailable: true,
      size: 35,
      maxOccupancy: 3,
      basePricePerNight: 120,
    },
    amenities: [
      {
        id: 1,
        name: "TV",
        quantity: 1,
        status: AMENITY_STATUS.AVAILABLE,
        lastChecked: 1697884800000, // UNIX timestamp
        category: AMENITY_CATEGORY.NON_CONSUMABLE_AMENITIES,
        unitPrice: 300,
        description: "TV màn hình phẳng 42 inch.",
      },
      {
        id: 2,
        name: "Mini Bar",
        quantity: 1,
        status: AMENITY_STATUS.AVAILABLE,
        lastChecked: 1697884800000,
        category: AMENITY_CATEGORY.CONSUMABLE_AMENITIES,
        unitPrice: 50,
        description: "Đầy đủ các loại đồ uống.",
      },
    ],
  },
  {
    id: 2,
    roomNumber: 102,
    floor: 1,
    isAvailable: false,
    currentStatus: ROOM_STATUS.OCCUPIED,
    description: "Phòng đơn với tiện nghi cơ bản.",
    isSmokingAllowed: false,
    lastCleaned: 1697798400000,
    roomType: {
      id: 2,
      name: "Standard Room",
      description: "Phòng tiêu chuẩn với giường đơn.",
      singleBedCount: 1,
      doubleBedCount: 0,
      extraBedAvailable: false,
      size: 20,
      maxOccupancy: 1,
      basePricePerNight: 80,
    },
    amenities: [
      {
        id: 3,
        name: "Điều hòa",
        quantity: 1,
        status: AMENITY_STATUS.MAINTENANCE,
        lastChecked: 1697702000000,
        category: AMENITY_CATEGORY.NON_CONSUMABLE_AMENITIES,
        unitPrice: 200,
        description: "Điều hòa không khí 2 chiều.",
      },
    ],
  },
];

const RoomList = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const handleAddRoom = () => {
    navigate("/admin/" + ADMIN_PATHS.ROOM_CREATE);
  };

  const handleSearch = (input: any) => {
    console.log(input);
  };

  const handleRowClick = (params: any) => {
    setSelectedRoom(params.row);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };
  return (
    <Container
      title="Danh sách phòng"
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Thêm phòng"
          onClick={handleAddRoom}
        />
      }
      linkToBack="/admin"
      titleToBack="Quay trở lại trang admin"
    >
      <div className={cx("room-list-box")}>
        <div className={cx("search")}>
          <Search placeholder="Tìm kiếm phòng" onSearch={handleSearch} />
        </div>
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem", cursor:"pointer"}}
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
      {selectedRoom && (
  <ShowInfoDialog
    open={openDialog}
    onClose={handleCloseDialog}
    title="Thông tin phòng"
  >
    <div>
      <p>
        <strong>ID:</strong> {selectedRoom.id}
      </p>
      <p>
        <strong>Số phòng:</strong> {selectedRoom.roomNumber}
      </p>
      <p>
        <strong>Tầng:</strong> {selectedRoom.floor}
      </p>
      <p>
        <strong>Trạng thái hiện tại:</strong> {selectedRoom.currentStatus}
      </p>
      <p>
        <strong>Miêu tả:</strong> {selectedRoom.description}
      </p>
      <p>
        <strong>Phòng hút thuốc:</strong>{" "}
        {selectedRoom.isSmokingAllowed ? "Có" : "Không"}
      </p>
      <p>
        <strong>Ngày dọn gần nhất:</strong> {selectedRoom.lastCleaned}
      </p>
      {selectedRoom.roomType && (
        <>
          <p>
            <strong>Loại phòng:</strong> {selectedRoom.roomType.name}
          </p>
          <p>
            <strong>Số giường đơn:</strong> {selectedRoom.roomType.singleBedCount}
          </p>
          <p>
            <strong>Số giường đôi:</strong> {selectedRoom.roomType.doubleBedCount}
          </p>
          <p>
            <strong>Diện tích:</strong> {selectedRoom.roomType.size} m²
          </p>
          <p>
            <strong>Sức chứa tối đa:</strong> {selectedRoom.roomType.maxOccupancy}
          </p>
          <p>
            <strong>Giá cơ bản mỗi đêm:</strong> {selectedRoom.roomType.basePricePerNight} $
          </p>
        </>
      )}
      {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
        <p>
          <strong>Tiện nghi:</strong>{" "}
          {selectedRoom.amenities.map((amenity) => amenity.name).join(", ")}
        </p>
      )}
    </div>
  </ShowInfoDialog>
)}

    </Container>
  );
};

export default RoomList;
