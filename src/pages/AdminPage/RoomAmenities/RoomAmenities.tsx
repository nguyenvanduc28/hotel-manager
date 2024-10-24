import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import styles from "./RoomAmenities.module.scss";
import classNames from "classnames/bind";
import Search from "../../../components/Search/Search";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { useNavigate } from "react-router-dom";
import OptionBar from "../../../components/OptionBar/OptionBar";
import OptionItem from "../../../components/OptionBar/OptionItem";
import { StyledChip } from "../../../components/StyledChip/StyledChip";
import { useState } from "react";
import { Consumables, Equipments } from "../../../types/hotel";
import { EQUIPMENT_STATUS } from "../../../constants/admin/constants";
const cx = classNames.bind(styles);

const consumableColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span style={{ paddingLeft: "10px" }}>ID</span>,
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>{params ? params.row.id : ""}</span>
    ),
  },
  {
    field: "barcode",
    headerName: "Mã sản phẩm",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => (
      <span style={{ paddingLeft: "10px" }}>Mã sản phẩm</span>
    ),
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>
        {params ? params.row.barcode : ""}
      </span>
    ),
  },
  {
    field: "name",
    headerName: "Tên Sản phẩm",
    flex: 3,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tên sản phẩm</span>,
    renderCell: (params) => <span>{params ? params.row.name : ""}</span>,
  },
  {
    field: "roomId",
    headerName: "Đang sử dụng",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Đang sử dụng</span>,
    renderCell: (params) => <span>{params?.row.roomId ? "x" : ""}</span>,
  },
  {
    field: "price",
    headerName: "Giá",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giá</span>,
    renderCell: (params) => <span>{params ? params.row.price + "đ" : ""}</span>,
  },
  {
    field: "unit",
    headerName: "Đơn vị",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Đơn vị</span>,
    renderCell: (params) => <span>{params ? params.row.unit : ""}</span>,
  },
  {
    field: "quantity",
    headerName: "Đơn vị",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số lượng</span>,
    renderCell: (params) => <span>{params ? params.row.quantity : ""}</span>,
  },
  {
    field: "consumableCategory",
    headerName: "Danh mục",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Danh mục</span>,
    renderCell: (params) => (
      <span>{params ? params.row.consumableCategory.name : ""}</span>
    ),
  },
  {
    field: "expiryDate",
    headerName: "Ngày hết hạn",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Ngày hết hạn</span>,
    renderCell: (params) => <span>{params ? params.row.expiryDate : ""}</span>,
  },
];
const equipmentColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span style={{ paddingLeft: "10px" }}>ID</span>,
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>{params ? params.row.id : ""}</span>
    ),
  },
  {
    field: "barcode",
    headerName: "Mã sản phẩm",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => (
      <span style={{ paddingLeft: "10px" }}>Mã sản phẩm</span>
    ),
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>
        {params ? params.row.barcode : ""}
      </span>
    ),
  },
  {
    field: "name",
    headerName: "Tên Sản phẩm",
    flex: 3,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tên thiết bị</span>,
    renderCell: (params) => <span>{params ? params.row.name : ""}</span>,
  },
  {
    field: "roomId",
    headerName: "Đang sử dụng",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Đang sử dụng</span>,
    renderCell: (params) => <span>{params?.row.roomId ? "x" : ""}</span>,
  },
  {
    field: "installationDate",
    headerName: "Ngày lắp đặt",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Ngày lắp đặt</span>,
    renderCell: (params) => (
      <span>{params ? params.row.installationDate : ""}</span>
    ),
  },

  {
    field: "equipmentCategory",
    headerName: "Trạng thái",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Trạng thái</span>,
    renderCell: (params) => (
      <span>{params ? params.row.equipmentCategory.name : ""}</span>
    ),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Trạng thái</span>,
    renderCell: (params) =>
      params ? <StyledChip label={params.row.status} /> : <span></span>,
  },
];
const dataConsumable: Consumables[] = [
  {
    id: 1,
    name: "Chuối",
    consumableCategory: {
      id: 1,
      name: "Trái cây",
      description: "Các loại trái cây tươi",
    },
    roomId: 101,
    price: 10000,
    quantity: 5,
    unit: "quả",
    barcode: "HH656506",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 2,
    name: "Nước cam ép",
    consumableCategory: {
      id: 2,
      name: "Đồ uống",
      description: "Nước giải khát các loại",
    },
    roomId: 102,
    price: 60000,
    quantity: 10,
    unit: "lon",
    barcode: "HH545405",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 3,
    name: "Bánh mì",
    consumableCategory: {
      id: 3,
      name: "Đồ ăn nhanh",
      description: "Các loại bánh mì ăn liền",
    },
    roomId: undefined, // Không liên kết với phòng
    price: 15000,
    quantity: 20,
    unit: "ổ",
    barcode: "HH123456",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 4,
    name: "Nước suối",
    consumableCategory: {
      id: 2,
      name: "Đồ uống",
      description: "Nước giải khát các loại",
    },
    roomId: 103,
    price: 10000,
    quantity: 50,
    unit: "chai",
    barcode: "HH789012",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 5,
    name: "Bánh quy",
    consumableCategory: {
      id: 3,
      name: "Đồ ăn nhanh",
      description: "Các loại bánh kẹo",
    },
    roomId: undefined,
    price: 30000,
    quantity: 15,
    unit: "gói",
    barcode: "HH456789",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 6,
    name: "Bia lon",
    consumableCategory: {
      id: 2,
      name: "Đồ uống",
      description: "Nước giải khát các loại",
    },
    roomId: 104,
    price: 45000,
    quantity: 30,
    unit: "lon",
    barcode: "HH852963",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 7,
    name: "Sữa tươi",
    consumableCategory: {
      id: 2,
      name: "Đồ uống",
      description: "Các loại sữa tươi",
    },
    roomId: undefined,
    price: 25000,
    quantity: 25,
    unit: "hộp",
    barcode: "HH741852",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 8,
    name: "Nước ngọt có ga",
    consumableCategory: {
      id: 2,
      name: "Đồ uống",
      description: "Nước giải khát các loại",
    },
    roomId: 105,
    price: 20000,
    quantity: 40,
    unit: "chai",
    barcode: "HH963852",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 9,
    name: "Trà xanh đóng chai",
    consumableCategory: {
      id: 2,
      name: "Đồ uống",
      description: "Trà đóng chai",
    },
    roomId: undefined,
    price: 15000,
    quantity: 20,
    unit: "chai",
    barcode: "HH258963",
    expiryDate: 1700000000, // timestamp
  },
  {
    id: 10,
    name: "Bánh ngọt",
    consumableCategory: {
      id: 3,
      name: "Đồ ăn nhanh",
      description: "Bánh kẹo các loại",
    },
    roomId: 106,
    price: 50000,
    quantity: 10,
    unit: "hộp",
    barcode: "HH369852",
    expiryDate: 1700000000, // timestamp
  },
];
const dataEquipment: Equipments[] = [
  {
    id: 1,
    name: "Điều hòa",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Các thiết bị điện trong phòng",
    },
    roomId: 101,
    barcode: "EQ001",
    installationDate: 1673318400, // timestamp
    status: EQUIPMENT_STATUS.WORKING,
  },
  {
    id: 2,
    name: "Tủ lạnh",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Các thiết bị điện trong phòng",
    },
    roomId: 102,
    barcode: "EQ002",
    installationDate: 1668470400, // timestamp
    status: EQUIPMENT_STATUS.WORKING,
  },
  {
    id: 3,
    name: "Máy sấy tóc",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Các thiết bị điện nhỏ gọn",
    },
    roomId: undefined, // Chưa được lắp vào phòng
    barcode: "EQ003",
    installationDate: 1683158400, // timestamp
    status: EQUIPMENT_STATUS.WORKING,
  },
  {
    id: 4,
    name: "Tivi",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Các thiết bị điện trong phòng",
    },
    roomId: 103,
    barcode: "EQ004",
    installationDate: 1680566400, // timestamp
    status: EQUIPMENT_STATUS.OUT_OF_ORDER,
  },
  {
    id: 5,
    name: "Bình nước nóng",
    equipmentCategory: {
      id: 2,
      name: "Thiết bị vệ sinh",
      description: "Thiết bị dùng trong nhà vệ sinh",
    },
    roomId: 104,
    barcode: "EQ005",
    installationDate: 1670726400, // timestamp
    status: EQUIPMENT_STATUS.REPLACED,
  },
  {
    id: 6,
    name: "Đèn ngủ",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Các thiết bị điện nhỏ gọn",
    },
    roomId: undefined, // Chưa được lắp vào phòng
    barcode: "EQ006",
    installationDate: 1675900800, // timestamp
    status: EQUIPMENT_STATUS.OUT_OF_ORDER,
  },
  {
    id: 7,
    name: "Máy lọc không khí",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Các thiết bị làm sạch không khí",
    },
    roomId: 105,
    barcode: "EQ007",
    installationDate: 1685846400, // timestamp
    status: EQUIPMENT_STATUS.WORKING,
  },
  {
    id: 8,
    name: "Lò vi sóng",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Các thiết bị nấu ăn",
    },
    roomId: 106,
    barcode: "EQ008",
    installationDate: 1675900800, // timestamp
    status: EQUIPMENT_STATUS.WORKING,
  },
  {
    id: 9,
    name: "Máy giặt",
    equipmentCategory: {
      id: 2,
      name: "Thiết bị vệ sinh",
      description: "Thiết bị trong nhà tắm",
    },
    roomId: undefined, // Chưa lắp đặt
    barcode: "EQ009",
    installationDate: 1668470400, // timestamp
    status: EQUIPMENT_STATUS.REPLACED,
  },
  {
    id: 10,
    name: "Quạt trần",
    equipmentCategory: {
      id: 1,
      name: "Thiết bị điện",
      description: "Thiết bị làm mát không khí",
    },
    roomId: 107,
    barcode: "EQ010",
    installationDate: 1688470400, // timestamp
    status: EQUIPMENT_STATUS.OUT_OF_ORDER,
  },
];

const RoomAmenities = () => {
  const navigate = useNavigate();
  const handleAddAmenity = () => {
    navigate("/admin/" + ADMIN_PATHS.ROOM_AMENITY_CREATE);
  };
  const [colDef, setColDef] = useState<any>(consumableColumns);
  const [data, setData] = useState<any>(dataConsumable);
  const [tab, setTab] = useState<any>("consumable");
  const handleSearch = (input: any) => {
    console.log(input);
  };
  const handleRowClick = (e: any) => {
    console.log(e);
  };
  const handleSelectConsumableTab = () => {
    setColDef(consumableColumns);
    setData(dataConsumable);
    setTab("consumable");
  };
  const handleSelectEquipmentTab = () => {
    setColDef(equipmentColumns);
    setData(dataEquipment);
    setTab("equipment");
  };
  return (
    <Container
      title="Danh sách tiện nghi"
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Thêm tiện nghi"
          onClick={handleAddAmenity}
        />
      }
      linkToBack="/admin"
      titleToBack="Quay trở lại trang admin"
    >
      <div className={cx("amenities-box")}>
        <div className={cx("optionbar")}>
          <OptionBar>
            <OptionItem
              title="Đồ dùng tiêu hao"
              onClick={handleSelectConsumableTab}
              active={tab === "consumable"}
            />
            <OptionItem
              title="Thiết bị"
              onClick={handleSelectEquipmentTab}
              active={tab === "equipment"}
            />
          </OptionBar>
        </div>
        <div className={cx("search")}>
          <Search placeholder="Tìm kiếm tiện nghi" onSearch={handleSearch} />
        </div>
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem" }}
            className={cx("data")}
            rows={data}
            columns={colDef}
            rowCount={10}
            // pageSizeOptions={[5, 10, 20]}
            // paginationModel={paginationModel}
            // paginationMode="server"
            disableColumnSorting={true}
            // onPaginationModelChange={setPaginationModel}
            onRowClick={handleRowClick}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default RoomAmenities;
