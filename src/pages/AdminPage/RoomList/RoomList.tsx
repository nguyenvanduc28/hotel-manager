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
import { useEffect, useState } from "react";
import ShowInfoDialog from "../../../components/ShowInfoDialog/ShowInfoDialog";
import { getAllRoom } from "../../../apis/roomApis/roomApis";
import ColumnFilter from "../../../components/ColumnFilter/ColumnFilter";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RoomIndoModal from "./RoomIndoModal";
import Loading from "../../../components/Loading/Loading";
const cx = classNames.bind(styles);

const defaultColumns: GridColDef[] = [
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
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Loại phòng</span>,
    renderCell: (params) => (
      <span>{params.row.roomType ? params.row.roomType.name : ""}</span>
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
    renderCell: (params) =>
      params.row.isAvailable ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "price",
    headerName: "Giá",
    flex: 1.5,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giá phòng/1 đêm</span>,
    renderCell: (params) => {
      // const price = params ? params.row.roomType.basePricePerNight : "0";
      // const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);
      return (
        <span>
          {params
            ? params.row.roomType.basePricePerNight.toLocaleString()
            : "0"}{" "}
          đ
        </span>
      );
    },
  },
];
const hiddenColumns: GridColDef[] = [
  {
    field: "description",
    headerName: "Mô tả",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) => <span>{params.row.description}</span>,
  },
  // {
  //   field: "lastCleaned",
  //   headerName: "Dọn dẹp lần cuối",
  //   flex: 1,
  //   headerClassName: "datagrid-header",
  //   cellClassName: "datagrid-cell",
  //   headerAlign: "left",
  //   renderCell: (params) =>
  //     params.row.lastCleaned
  //       ? moment.unix(params.row.lastCleaned).format("YYYY-MM-DD")
  //       : "",
  // },
  {
    field: "isSmokingAllowed",
    headerName: "Cho phép hút thuốc",
    flex: 1,
    renderCell: (params) =>
      params.row.isSmokingAllowed ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasPrivateKitchen",
    headerName: "Bếp riêng",
    flex: 1,
    renderCell: (params) =>
      params.row.hasPrivateKitchen ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasPrivateBathroom",
    headerName: "Phòng tắm riêng",
    flex: 1,
    renderCell: (params) =>
      params.row.hasPrivateBathroom ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasBalcony",
    headerName: "Ban công",
    flex: 1,
    renderCell: (params) =>
      params.row.hasBalcony ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasLakeView",
    headerName: "Hồ nước",
    flex: 1,
    renderCell: (params) =>
      params.row.hasLakeView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasGardenView",
    headerName: "Vườn",
    flex: 1,
    renderCell: (params) =>
      params.row.hasGardenView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasPoolView",
    headerName: "Hồ bơi",
    flex: 1,
    renderCell: (params) =>
      params.row.hasPoolView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasMountainView",
    headerName: "Núi",
    flex: 1,
    renderCell: (params) =>
      params.row.hasMountainView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasLandmarkView",
    headerName: "Địa danh",
    flex: 1,
    renderCell: (params) =>
      params.row.hasLandmarkView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasCityView",
    headerName: "Thành phố",
    flex: 1,
    renderCell: (params) =>
      params.row.hasCityView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasRiverView",
    headerName: "Sông",
    flex: 1,
    renderCell: (params) =>
      params.row.hasRiverView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasCourtyardView",
    headerName: "Sân",
    flex: 1,
    renderCell: (params) =>
      params.row.hasCourtyardView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasFreeWifi",
    headerName: "Wi-Fi miễn phí",
    flex: 1,
    renderCell: (params) =>
      params.row.hasFreeWifi ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasSoundproofing",
    headerName: "Cách âm",
    flex: 1,
    renderCell: (params) =>
      params.row.hasSoundproofing ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
];

const RoomList = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await getAllRoom();
        setData(rooms);
      } catch (error) {
        console.error("Failed to fetch room types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
  const [visibleColumns, setVisibleColumns] =
    useState<GridColDef[]>(defaultColumns);

  return (
    <Container
      fullscreen
      title="Danh sách phòng"
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Thêm phòng"
          onClick={handleAddRoom}
        />
      }
    >
      <div className={cx("room-list-box")}>
        <div className={cx("search")}>
          <Search
            placeholder="Tìm kiếm phòng"
            handleSearch={(e) => handleSearch(e)}
          />
        </div>
        <div className={cx("list")}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <ColumnFilter
                hiddenColumns={hiddenColumns}
                defaultVisibleColumns={defaultColumns}
                onChange={(columns) => setVisibleColumns(columns)}
              />
              <DataGrid
                style={{ fontSize: "1.4rem", cursor: "pointer" }}
                className={cx("data")}
                rows={data}
                columns={visibleColumns}
                rowCount={data.length}
                disableColumnSorting={true}
                onRowClick={handleRowClick}
                rowSelection={false}
                hideFooterPagination={true}
              />
            </>
          )}
        </div>
      </div>
      {selectedRoom && (
        <RoomIndoModal
          roomInfo={selectedRoom}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Container>
  );
};

export default RoomList;
