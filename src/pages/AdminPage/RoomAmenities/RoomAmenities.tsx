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
import { useEffect, useState } from "react";
import { getConsumables, getEquipment } from "../../../apis/roomApis/roomApis";
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
    flex: 2.5,
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
    renderCell: (params) => <span>{params?.row.room?.id ? "x" : ""}</span>,
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
    renderCell: (params) => {
      const price = params ? params.row.price : "";
      const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);
      return <span>{formattedPrice} đ</span>;
  },
  
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
    headerName: "Số lượng",
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
      <span>{params ? params.row.consumableCategory?.name : ""}</span>
    ),
  },
  {
    field: "expiryDate",
    headerName: "Ngày hết hạn",
    flex: 3,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Ngày hết hạn</span>,
    renderCell: (params) => {
      const date = new Date(params ? params.row.expiryDate : 0);
      return (
        <span>
          {params ? date.toLocaleString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) : ""}
        </span>
      );
    },
    
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
    renderCell: (params) => <span>{params?.row.room?.id ? "x" : ""}</span>,
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
    renderCell: (params) => {
      const date = new Date(params ? params.row.installationDate : 0);
      return (
        <span>
          {params ? date.toLocaleString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) : ""}
        </span>
      );
    },
  },

  {
    field: "equipmentCategory",
    headerName: "Danh mục",
    flex: 2,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Danh mục</span>,
    renderCell: (params) => (
      <span>{params ? params.row.equipmentCategory?.name : ""}</span>
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
const RoomAmenities = () => {
  const navigate = useNavigate();
  const handleAddAmenity = () => {
    navigate("/admin/" + ADMIN_PATHS.ROOM_AMENITY_CREATE);
  };
  const [colDef, setColDef] = useState<any>(consumableColumns);
  
  const [tab, setTab] = useState<any>("consumable");
  const [data, setData] = useState<any>(null);
  const handleSearch = (input: any) => {
    console.log(input);
  };
  const handleRowClick = (e: any) => {
    console.log(e);
  };
  const handleSelectConsumableTab = () => {
    setColDef(consumableColumns);
    setTab("consumable");
    fetchConsumables();
  };
  const handleSelectEquipmentTab = () => {
    setColDef(equipmentColumns);
    setTab("equipment");
    fetchEquipments();
  };

  const fetchConsumables = async () => {
    try {
      const data = await getConsumables();
      setData(data)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm tiêu hao:", error);
    }
  };
  const fetchEquipments = async () => {
    try {
      const data = await getEquipment();
      setData(data)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thiết bị:", error);
    }
  };
  useEffect(() => {
    fetchConsumables();
  }, []);

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
