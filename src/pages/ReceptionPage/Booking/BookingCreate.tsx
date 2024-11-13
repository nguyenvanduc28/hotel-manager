import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { CheckBox, CloseOutlined } from "@mui/icons-material";
import InputText from "../../../components/Input/InputText";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./BookingCreate.module.scss";
import classNames from "classnames/bind";
import moment from "moment";
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
import {
  ADMIN_PATHS,
  RECEPTION_PATHS,
} from "../../../constants/admin/adminPath";
import { BookingForm, CustomerForm } from "../../../types/forms";
// import { createBooking } from "../../../apis/bookingApis/bookingApis";
import { useNavigate } from "react-router-dom";
import { BOOKING_STATUS, GENDERS } from "../../../constants/admin/constants";
import SearchWithMenu from "../../../components/SearchWithMenu/SearchWithMenu";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Customer, RoomInfo } from "../../../types/hotel";
import { getAvailableRooms } from "../../../apis/roomApis/roomApis";
import {
  createBooking,
  createCustomer,
} from "../../../apis/bookingApis/bookingApis";
import ColumnFilter from "../../../components/ColumnFilter/ColumnFilter";
import GroupRadio from "../../../components/GroupRadio/GroupRadio";
import TextArea from "../../../components/TextArea/TextArea";
import { searchCustomersByName } from "../../../apis/customerApis/customerApis";

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
    headerName: "Giá phòng (giá cơ bản/đêm)",
    flex: 1,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giá phòng/1 đêm</span>,
    renderCell: (params) => {
      // const price = params ? params.row.roomType.basePricePerNight.toLocaleString() : "0";
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
  {
    field: "lastCleaned",
    headerName: "Dọn dẹp lần cuối",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) =>
      params.row.lastCleaned
        ? moment.unix(params.row.lastCleaned).format("YYYY-MM-DD")
        : "",
  },
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

const BookingCreate: React.FC<BookingCreateProps> = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalCus, setOpenModalCus] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<RoomInfo[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    id: 0,
    customer: { id: 0 },
    checkInDate: undefined,
    checkOutDate: undefined,
    bookingDate: Date.now() / 1000,
    estimatedArrivalTime: undefined,
    isGroup: false,
    totalCost: 0,
    status: BOOKING_STATUS.Pending, // giá trị mặc định
    deposit: 0,
    cancellationPolicy: "Miễn phí hủy trong 12h",
    canceledAt: undefined,
    isGuaranteed: true,
    numberOfAdults: 2,
    numberOfChildren: 0,
    rooms: [],
    consumablesUsed: [],
    equipmentDamagedList: [],
  });
  const [totalNights, setTotalNights] = useState<number>(0);
  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    id: 0,
    name: "",
    email: "",
    phoneNumber: "",
    gender: undefined,
    birthDay: undefined,
    nationality: "",
    identityNumber: "",
    address: "",
    notes: "",
  });

  const handleChangeCus = (key: keyof CustomerForm, value: any) => {
    setCustomerForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  // Call API to save customer
  const handleSaveCus = async () => {
    try {
      await createCustomer(customerForm);
      fetchCustomers("");
    } catch (error) {
      console.error("Lỗi khi tạo khách hàng:", error);
    }
  };
  const handleChange = (key: keyof BookingForm, value: any) => {
    setBookingForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  const fetchAvailableRooms = async (
    checkInDate: number,
    checkOutDate: number
  ) => {
    try {
      const rooms = await getAvailableRooms(checkInDate, checkOutDate);
      setRoomList(rooms);
    } catch (error) {
      console.error("Failed to fetch available rooms:", error);
    }
  };
  const fetchCustomers = async (name: string) => {
    try {
      const customers = await searchCustomersByName(name);
      setCustomerList(customers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const handleSave = async () => {
    try {
      const result = await createBooking(bookingForm);

      console.log("Booking đã được tạo:", bookingForm);
      navigate("/reception/" + RECEPTION_PATHS.BOOKING_LIST);
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
    }
  };
  const handleRowClick = (params: any) => {
    if (bookingForm.rooms.find((item) => item.id == params.row.id))
      alert("trùng rồi");
    else {
      const updatedRooms = [...bookingForm.rooms, params.row];
      handleChange("rooms", updatedRooms);

      const newTotalCost =
        updatedRooms.reduce((acc, item) => {
          return acc + (item.roomType?.basePricePerNight || 0) * totalNights;
        }, 0) + bookingForm.deposit;

      handleChange("totalCost", newTotalCost);

      setOpenModal(false);
    }
  };
  const [visibleColumns, setVisibleColumns] =
    useState<GridColDef[]>(defaultColumns);
  const handleDeleteRom = (roomId: number) => {
    const updatedRooms = bookingForm.rooms.filter((room) => room.id !== roomId);
    setBookingForm((prevForm) => ({
      ...prevForm,
      rooms: updatedRooms,
    }));

    const newTotalCost =
      updatedRooms.reduce((acc, item) => {
        return acc + (item.roomType?.basePricePerNight || 0) * totalNights;
      }, 0) + (bookingForm.deposit || 0);
    handleChange("totalCost", newTotalCost);
  };
  return (
    <Container fullscreen title="Thêm Booking">
      <div className={cx("booking-wrapper")}>
        <div className={cx("booking-create")}>
          <SearchWithMenu
            title="Thông tin khách hàng"
            options={customerList.map((cus) => ({
              value: cus.id,
              label: cus.name + " - " + cus.phoneNumber,
            }))}
            handleSearch={(query) => {
              fetchCustomers(query);
              console.log(query);
            }}
            handleButtonClick={() => setOpenModalCus(true)}
            titleButton="Thêm khách hàng"
            onSelect={(value) => {
              const selectedCustomer = customerList.find(
                (cus) => cus.id === value
              );
              if (selectedCustomer) {
                handleChange("customer", selectedCustomer);
              }
            }}
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
                    ? moment.unix(bookingForm.checkInDate).format("YYYY-MM-DD")
                    : ""
                }
                title="Ngày nhận phòng"
                placeholder="Nhập ngày nhận phòng"
                variant="inline-group"
                type="date"
                onChange={(e) => {
                  const timestamp = moment(e.target.value, "YYYY-MM-DD").unix();
                  handleChange("checkInDate", timestamp);
                  handleChange("rooms", []);
                }}
              />
            </div>
            <div className={cx("box-item")}>
              <InputText
                value={
                  bookingForm.checkOutDate
                    ? moment.unix(bookingForm.checkOutDate).format("YYYY-MM-DD")
                    : ""
                }
                title="Ngày trả phòng"
                placeholder="Nhập ngày trả phòng"
                variant="inline-group"
                type="date"
                onChange={(e) => {
                  const checkOutTimestamp = moment(
                    e.target.value,
                    "YYYY-MM-DD"
                  ).unix();

                  if (!bookingForm.checkInDate) {
                    alert("Vui lòng chọn ngày nhận phòng trước.");
                    return;
                  }

                  if (checkOutTimestamp <= bookingForm.checkInDate) {
                    alert("Ngày trả phòng phải lớn hơn ngày nhận phòng.");
                    return;
                  }

                  // Tính số đêm lưu trú
                  const nights = moment
                    .unix(checkOutTimestamp)
                    .diff(moment.unix(bookingForm.checkInDate), "days");

                  // Cập nhật số đêm lưu trú
                  setTotalNights(nights);
                  handleChange("checkOutDate", checkOutTimestamp);
                  handleChange("rooms", []);

                  // Gọi API chỉ nếu số đêm lớn hơn 0
                  if (nights > 0) {
                    fetchAvailableRooms(
                      bookingForm.checkInDate,
                      checkOutTimestamp
                    );
                  }
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
                type="number"
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
          <div className={cx("box")}>
            <div className={cx("box-item")}>
              <div className={cx("checkbox-wrapper")}>
                <label>
                  <span className={cx("title")}>Đảm bảo phòng?</span>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={bookingForm.isGuaranteed}
                    onChange={(e) =>
                      handleChange("isGuaranteed", e.target.checked)
                    }
                  />
                </label>
              </div>
            </div>
            <div className={cx("box-item")}>
              {bookingForm.isGuaranteed && (
                <InputText
                  value={bookingForm.deposit?.toString()}
                  title="Số tiền đặt cọc để đảm bảo"
                  placeholder="Nhập số tiền"
                  variant="inline-group"
                  type="number"
                  onChange={(e) => {
                    const parsedValue = parseFloat(e.target.value);
                    handleChange(
                      "deposit",
                      isNaN(parsedValue) ? 0 : parsedValue
                    );

                    handleChange(
                      "totalCost",
                      (bookingForm.totalCost || 0) -
                        (bookingForm.deposit || 0) +
                        (isNaN(parsedValue) ? 0 : parsedValue)
                    );
                  }}
                  suffix="vnđ"
                />
              )}
            </div>
          </div>
          <div className={cx("room-list")}>
            <Title title="Danh sách phòng" />

            {bookingForm.rooms.map((room) => (
              <div className={cx("item-box-wrapper", "item-box--value")}>
                <div className={cx("item-left")}>
                  <div className={cx("item-image")}>
                    {room.imageList ? (
                      <img
                        src={room.imageList[0].url || ''}
                        alt="imageroom"
                      />
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
                  <div className={cx("item-right-info")}>
                    <div className={cx("item-right-box")}>
                      <span className={cx("item-right-title")}>
                        Loại phòng:
                      </span>
                      <span className={cx("item-right-value")}>
                        {room.roomType?.name}
                      </span>
                    </div>
                    <div className={cx("item-right-box")}>
                      <span className={cx("item-right-title")}>
                        Giá cơ bản:
                      </span>
                      <span className={cx("item-right-value")}>
                        {room.roomType?.basePricePerNight &&
                          room.roomType?.basePricePerNight.toLocaleString() +
                            " đ/đêm"}
                      </span>
                    </div>
                  </div>
                  <div className={cx("item-right-button")}>
                    <button
                      className={cx("item-right-button--button")}
                      onClick={(e) => handleDeleteRom(room.id || 0)}
                    >
                      <RemoveCircleOutlineIcon
                        style={{ fontSize: "1.6rem", color: "red" }}
                      />
                    </button>
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
        </div>
        <div className={cx("booking-info")}>
          <div className={cx("booking-info-title")}>
            <span className={cx("title")}>Chi tiết phiếu đặt:</span>
          </div>
          <div className={cx("booking-info-content")}>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Họ và tên:</span>
              <span className={cx("item-value")}>
                {bookingForm.customer.name ? bookingForm.customer.name : "..."}
              </span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Email:</span>
              <span className={cx("item-value")}>
                {bookingForm.customer.email
                  ? bookingForm.customer.email
                  : "..."}
              </span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Số điện thoại:</span>
              <span className={cx("item-value")}>
                {bookingForm.customer.phoneNumber
                  ? bookingForm.customer.phoneNumber
                  : "..."}
              </span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Địa chỉ:</span>
              <span className={cx("item-value")}>
                {bookingForm.customer.address
                  ? bookingForm.customer.address
                  : "..."}
              </span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Ngày đặt:</span>
              <span className={cx("item-value")}>
                {bookingForm.bookingDate
                  ? moment.unix(bookingForm.bookingDate).format("YYYY-MM-DD")
                  : ""}
              </span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Ngày nhận phòng:</span>
              <span className={cx("item-value")}>
                14:00{" "}
                {bookingForm.checkInDate
                  ? moment.unix(bookingForm.checkInDate).format("YYYY-MM-DD")
                  : ""}
              </span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Ngày trả phòng:</span>
              <span className={cx("item-value")}>
                12:00{" "}
                {bookingForm.checkOutDate
                  ? moment.unix(bookingForm.checkOutDate).format("YYYY-MM-DD")
                  : ""}
              </span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Tổng số đêm:</span>
              <span className={cx("item-value")}>{totalNights} đêm</span>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Tổng số người:</span>
              <span className={cx("item-value")}>
                {bookingForm.numberOfAdults} người lớn,{" "}
                {bookingForm.numberOfChildren} trẻ em
              </span>
            </div>

            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Phòng đã đặt:</span>
              <div className={cx("item-rooms")}>
                {bookingForm.rooms.map((room, index) => (
                  <div key={index} className={cx("room-item")}>
                    <span className={cx("room-title")}>
                      Phòng {room.roomNumber} - {room.roomType?.name}
                    </span>
                    <div className={cx("room-details")}>
                      <span className={cx("room-detail")}>
                        Giá cơ bản:{" "}
                        {room.roomType?.basePricePerNight &&
                          room.roomType?.basePricePerNight.toLocaleString()}
                        {" đ x " + totalNights + " đêm"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={cx("info-item")}>
              <span className={cx("item-title")}>Số tiền đặt cọc:</span>
              <span className={cx("item-value")}>
                {bookingForm.deposit &&
                  bookingForm.deposit.toLocaleString() + " đ"}
              </span>
            </div>
            <div className={cx("info-item", "total-cost")}>
              <span className={cx("item-title", "total-cost-title")}>
                Tổng tiền đặt phòng:
              </span>
              <span className={cx("item-value", "total-cost-value")}>
                {bookingForm.totalCost &&
                  bookingForm.totalCost.toLocaleString() + " đ"}
              </span>
            </div>
          </div>
        </div>
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
            ? moment.unix(bookingForm.checkInDate).format("YYYY-MM-DD")
            : ""}{" "}
          đến ngày{" "}
          {bookingForm.checkOutDate
            ? moment.unix(bookingForm.checkOutDate).format("YYYY-MM-DD")
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
          <Button
            icon={<CloseOutlined />}
            onClick={() => setOpenModal(false)}
            content="Đóng"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={openModalCus}
        onClose={() => setOpenModalCus(false)}
        hideBackdrop
        PaperProps={{
          style: {
            width: "1000px",
            maxWidth: "1000px",
          },
        }}
      >
        <DialogTitle style={{ fontSize: "1.8rem", textAlign: "center" }}>
          Tạo khách hàng mới
        </DialogTitle>
        <Divider />
        <DialogContent style={{ fontSize: "1.6rem" }}>
          <InputText
            value={customerForm.name}
            title="Tên khách hàng"
            placeholder="Nhập tên khách hàng"
            onChange={(e) => handleChangeCus("name", e.target.value)}
          />
          <InputText
            value={customerForm.email}
            title="Email"
            placeholder="Nhập email"
            onChange={(e) => handleChangeCus("email", e.target.value)}
          />
          <InputText
            value={customerForm.phoneNumber}
            title="Số điện thoại"
            placeholder="Nhập số điện thoại"
            onChange={(e) => handleChangeCus("phoneNumber", e.target.value)}
          />
          <InputText
            value={customerForm.identityNumber}
            title="Số CMND/CCCD"
            placeholder="Nhập số CMND/CCCD"
            onChange={(e) => handleChangeCus("identityNumber", e.target.value)}
          />

          <div className={cx("box")}>
            <div className={cx("box-item")}>
              <InputText
                value={customerForm.address}
                variant="inline-group"
                title="Địa chỉ"
                placeholder="Nhập địa chỉ"
                onChange={(e) => handleChangeCus("address", e.target.value)}
              />
            </div>
            <div className={cx("box-item")}>
              <InputText
                value={customerForm.nationality}
                variant="inline-group"
                title="Quốc tịch"
                placeholder="Nhập quốc tịch"
                onChange={(e) => handleChangeCus("nationality", e.target.value)}
              />
            </div>
          </div>
          <div className={cx("box")}>
            <div className={cx("box-item")}>
              <GroupRadio
                title="Giới tính"
                value={customerForm.gender}
                onSelect={(value) => handleChangeCus("gender", value)}
                options={[
                  { value: GENDERS.MALE, label: "Nam" },
                  { value: GENDERS.FEMALE, label: "Nữ" },
                  { value: GENDERS.OTHER, label: "Khác" },
                ]}
              />
            </div>
            <div className={cx("box-item")}>
              <InputText
                value={
                  customerForm.birthDay
                    ? moment.unix(customerForm.birthDay).format("YYYY-MM-DD")
                    : ""
                }
                variant="inline-group"
                title="Ngày sinh"
                type="date"
                onChange={(e) => {
                  const timestamp = moment(e.target.value, "YYYY-MM-DD").unix();
                  handleChangeCus("birthDay", timestamp);
                }}
              />
            </div>
          </div>

          <TextArea
            title="Ghi chú"
            value={customerForm.notes}
            onChange={(e) => handleChangeCus("notes", e.target.value)}
            placeholder="Nhập ghi chú"
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            icon={<CloseOutlined />}
            onClick={() => setOpenModalCus(false)}
            content="Đóng"
          />
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              handleSaveCus();
              setOpenModalCus(false);
            }}
            content="Lưu"
          />
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingCreate;
