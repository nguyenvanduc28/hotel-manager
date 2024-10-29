import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import styles from "./BookingCreate.module.scss";
import classNames from "classnames/bind";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
} from "@mui/material";
import Title from "../../../components/Title/Title";
import AddIcon from "@mui/icons-material/Add";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { BookingForm } from "../../../types/forms";
// import { createBooking } from "../../../apis/bookingApis/bookingApis";
import { useNavigate } from "react-router-dom";
import { BOOKING_STATUS } from "../../../constants/admin/constants";
import SearchWithMenu from "../../../components/SearchWithMenu/SearchWithMenu";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Customer, RoomInfo } from "../../../types/hotel";
import { getAllRoom } from "../../../apis/roomApis/roomApis";
import { getCustomers } from "../../../apis/bookingApis/bookingApis";
import { StyledChip } from "../../../components/StyledChip/StyledChip";
import ColumnFilter from "../../../components/ColumnFilter/ColumnFilter";

type BookingCreateProps = {};

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
  {
    field: "lastCleaned",
    headerName: "Dọn dẹp lần cuối",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) =>
      params.row.lastCleaned
        ? new Date(params.row.lastCleaned * 1000).toISOString().split("T")[0]
        : "",
  },
  {
    field: "isSmokingAllowed",
    headerName: "Cho phép hút thuốc",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) => (
      <StyledChip
        label={params.row.isSmokingAllowed ? "Có" : "Không"}
        color={params.row.isSmokingAllowed ? "success" : "error"}
      />
    ),
  },
  {
    field: "has_private_kitchen",
    headerName: "Bếp riêng",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) => (
      <StyledChip
        label={params.row.has_private_kitchen ? "Có" : "Không"}
        color={params.row.has_private_kitchen ? "success" : "error"}
      />
    ),
  },
  {
    field: "size",
    headerName: "Diện tích",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) => <span>{params.row.size} m²</span>,
  },
  {
    field: "roomType.sizeRange",
    headerName: "Khoảng diện tích phòng",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) =>
      params.row.roomType ? params.row.roomType.sizeRange : "Không có",
  },
  {
    field: "roomType.maxOccupancy",
    headerName: "Số người tối đa",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) =>
      params.row.roomType ? params.row.roomType.maxOccupancy : "Không có",
  },
  {
    field: "roomType.basePricePerNight",
    headerName: "Giá cơ bản / Đêm",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) =>
      params.row.roomType
        ? `${
            params.row.roomType?.basePricePerNight &&
            new Intl.NumberFormat("vi-VN").format(
              params.row.roomType?.basePricePerNight
            )
          } VND`
        : "Không có",
  },
];

const BookingCreate: React.FC<BookingCreateProps> = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<RoomInfo[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    id: 0,
    customer: { id: 0 },
    checkInDate: undefined,
    checkOutDate: undefined,
    bookingDate: Date.now(),
    estimatedArrivalTime: undefined,
    isGroup: false,
    totalCost: 0,
    status: BOOKING_STATUS.Pending, // giá trị mặc định
    deposit: 0,
    cancellationPolicy: "Miễn phí hủy trong 12h",
    canceledAt: undefined,
    isGuaranteed: true,
    rooms: [],
  });

  const handleChange = (key: keyof BookingForm, value: any) => {
    setBookingForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  const fetchRooms = async () => {
    try {
      const rooms = await getAllRoom();
      console.log(rooms);

      setRoomList(rooms);
    } catch (error) {
      console.error("Failed to fetch room types:", error);
    }
  };
  const fetchCustomers = async () => {
    try {
      const customers = await getCustomers();
      setCustomerList(customers);
    } catch (error) {
      console.error("Lấy danh sách khách hàng thất bại:", error);
    }
  };
  useEffect(() => {
    fetchRooms();
    fetchCustomers();
  }, []);

  // Gọi API để lưu thông tin booking
  const handleSave = async () => {
    try {
      //   const result = await createBooking(bookingForm);

      console.log("Booking đã được tạo:", bookingForm);
      navigate("/admin/" + ADMIN_PATHS.BOOKINGS);
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
    }
  };
  const handleRowClick = (params: any) => {
    if (bookingForm.rooms.find((item) => item.id == params.row.id))
      alert("trùng rồi");
    else {
      handleChange("rooms", [...bookingForm.rooms, params.row]);
      setOpenModal(false);
    }
  };
  const [visibleColumns, setVisibleColumns] =
    useState<GridColDef[]>(defaultColumns);

  return (
    <Container title="Thêm Booking">
      <SearchWithMenu
        title="Thông tin khách hàng"
        options={customerList.map((cus) => ({
          value: cus.id,
          label: cus.name,
        }))}
        handleSearch={(query) => console.log(query)}
        handleButtonClick={() => console.log("thêm khách hàng")}
        titleButton="Thêm khách hàng"
        onSelect={(value) => handleChange("customer", { id: value })}
        widthMenu={"50%"}
      />
      <div className={cx("divider")}>
        <Divider />
      </div>
      {/* <Title title="Thông tin booking:" /> */}
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={
              bookingForm.checkInDate
                ? new Date(bookingForm.checkInDate * 1000)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            title="Ngày nhận phòng"
            placeholder="Nhập ngày nhận phòng"
            variant="inline-group"
            type="date"
            onChange={(e) => {
              const timestamp = new Date(e.target.value).getTime() / 1000;
              handleChange("checkInDate", timestamp);
              handleChange("rooms", []);
            }}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={
              bookingForm.checkOutDate
                ? new Date(bookingForm.checkOutDate * 1000)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            title="Ngày trả phòng"
            placeholder="Nhập ngày trả phòng"
            variant="inline-group"
            type="date"
            onChange={(e) => {
              const timestamp = new Date(e.target.value).getTime() / 1000;
              handleChange("checkOutDate", timestamp);
              handleChange("rooms", []);
              fetchRooms();
            }}
          />
        </div>
      </div>
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={bookingForm.numberOfAdults?.toString()}
            title="Số người lớn: "
            placeholder="Nhập số người"
            variant="inline-group"
            type="number"
            onChange={(e) => {
              const parsedValue = parseFloat(e.target.value);
              handleChange(
                "numberOfAdults",
                isNaN(parsedValue) ? 0 : parsedValue
              );
            }}
            suffix="người"
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={bookingForm.numberOfChildren?.toString()}
            title="Số trẻ em"
            placeholder="Nhập số người"
            variant="inline-group"
            onChange={(e) => {
              const parsedValue = parseFloat(e.target.value);
              handleChange(
                "numberOfChildren",
                isNaN(parsedValue) ? 0 : parsedValue
              );
            }}
            suffix="người"
          />
        </div>
      </div>
      <div className={cx("room-list")}>
        <Title title="Danh sách phòng" />

        {bookingForm.rooms.map((room) => (
          <div className={cx("item-box-wrapper", "item-box--value")}>
            <div className={cx("item-left")}>
              <div className={cx("item-image")}>
                {room.images?.[0] ? (
                  <img src={room.images[0].replace("\\", "")} alt="imageroom" />
                ) : (
                  "none"
                )}
              </div>
              <div className={cx("item-info")}>
                <span className={cx("room-title")}> Phòng</span>
                <span className={cx("room-num")}> {room.roomNumber}</span>
              </div>
            </div>
            <div className={cx("item-right")}>
              <div className={cx("item-right-box")}>
                <span className={cx("item-right-title")}>Loại phòng:</span>
                <span className={cx("item-right-value")}>
                  {room.roomType?.name}
                </span>
              </div>
              <div className={cx("item-right-box")}>
                <span className={cx("item-right-title")}>Giá cơ bản:</span>
                <span className={cx("item-right-value")}>
                  {room.roomType?.basePricePerNight &&
                    new Intl.NumberFormat("vi-VN").format(
                      room.roomType?.basePricePerNight
                    )}
                  đ/đêm
                </span>
              </div>
            </div>
          </div>
        ))}
        <div
          className={cx("item-box-wrapper", "item-box--button")}
          onClick={() => {
            if (bookingForm.checkInDate && bookingForm.checkOutDate)
              setOpenModal(true);
            else alert("chọn ngày đê");
          }}
        >
          <AddIcon />
          <span>Thêm phòng</span>
        </div>
      </div>
      <div className={cx("divider")}>
        <Divider />
      </div>
      <div className={cx("button-save")}>
        <Button
          icon={<SaveOutlinedIcon />}
          content="Lưu"
          onClick={handleSave}
        />
      </div>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        hideBackdrop
        PaperProps={{
          style: {
            width: "1000px",
            maxWidth: "1000px",
          },
        }}
      >
        <DialogTitle style={{ fontSize: "1.8rem", textAlign: "center" }}>
          Danh sách phòng trống từ ngày{" "}
          {bookingForm.checkInDate
            ? new Date(bookingForm.checkInDate * 1000)
                .toISOString()
                .split("T")[0]
            : ""}{" "}
          đến ngày{" "}
          {bookingForm.checkOutDate
            ? new Date(bookingForm.checkOutDate * 1000)
                .toISOString()
                .split("T")[0]
            : ""}
        </DialogTitle>
        <Divider />
        <DialogContent style={{ fontSize: "1.6rem" }}>
          <ColumnFilter
            hiddenColumns={hiddenColumns}
            defaultVisibleColumns={defaultColumns}
            onChange={(columns) => setVisibleColumns(columns)}
          />
          <DataGrid
            style={{ fontSize: "1.4rem", cursor: "pointer" }}
            rows={roomList}
            columns={visibleColumns}
            rowCount={roomList.length}
            disableColumnSorting={true}
            onRowClick={handleRowClick}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} content="Đóng" />
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingCreate;
