import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Container from "../../../components/Container/Container";
import OptionBar from "../../../components/OptionBar/OptionBar";
import OptionItem from "../../../components/OptionBar/OptionItem";
import Search from "../../../components/Search/Search";
import { StyledChip } from "../../../components/StyledChip/StyledChip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// import { getBookings } from "../../../apis/bookingApis/bookingApis";
import styles from "./Bookings.module.scss";
import classNames from "classnames/bind";
import { BOOKING_STATUS, BookingStatus } from "../../../constants/admin/constants";
import { Booking } from "../../../types/hotel";
import { useNavigate } from "react-router-dom";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import Button from "../../../components/Button/Button";

const cx = classNames.bind(styles);
const mockBookings: Booking[] = [
  {
    id: 1,
    customer: { id: 1, name: "Nguyễn Văn A" },
    checkInDate: undefined,
    checkOutDate: undefined,
    status: BOOKING_STATUS.Pending,
    totalCost: 2000000,
    bookingDate: 1789595090404,
    rooms: [{id:2, roomNumber:102}]
  },
  {
    id: 2,
    customer: {
      name: "Trần Thị B",
      id: 23
    },
    checkInDate: undefined,
    checkOutDate: undefined,
    status: BOOKING_STATUS.Confirmed,
    totalCost: 3000000,
    bookingDate: 1789595099404,
    rooms: [{id:2, roomNumber:103}]
  },
  {
    id: 3,
    customer: {
      name: "Phạm Văn C",
      id: 34
    },
    checkInDate: 1789111909404,
    checkOutDate: 1789950909404,
    status: BOOKING_STATUS.Completed,
    totalCost: 2500000,
    bookingDate: 1789595099404,
    rooms: [{id:3, roomNumber:203}]
  },
];
const bookingColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    renderCell: (params) => <span>{params.row.id}</span>,
  },
  {
    field: "customer",
    headerName: "Khách hàng",
    flex: 2,
    renderCell: (params) => <span>{params.row.customer.name}</span>,
  },
  {
    field: "bookingDate",
    headerName: "Ngày đặt phòng",
    flex: 2,
    renderCell: (params) => {
      const date = new Date(params ? params.row.bookingDate : 0);
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
    field: "checkInDate",
    headerName: "Ngày nhận phòng",
    flex: 2,
    renderCell: (params) => {
      const date = new Date(params ? params.row.checkInDate : 0);
      return (
        <span>
          {params?.row?.checkInDate ? date.toLocaleString("vi-VN", {
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
    field: "checkOutDate",
    headerName: "Ngày trả phòng",
    flex: 2,
    renderCell: (params) => {
      const date = new Date(params ? params.row.checkOutDate : 0);
      return (
        <span>
          {params?.row?.checkOutDate ? date.toLocaleString("vi-VN", {
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
    field: "rooms",
    headerName: "Danh sách phòng",
    flex: 2,
    renderCell: (params) => {
        return <span>
          {params?.row?.rooms.map((room :any) => (<span>{room.roomNumber},</span>))}
        </span>
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    flex: 2,
    renderCell: (params) => <StyledChip label={params.row.status} />,
  },
  {
    field: "totalCost",
    headerName: "Tổng chi phí",
    flex: 2,
    renderCell: (params) => {
      const formattedCost = new Intl.NumberFormat("vi-VN").format(params.row.totalCost);
      return <span>{formattedCost} đ</span>;
    },
  },
];

const Bookings = () => {
  const navigate = useNavigate();
  const handleBooking = () => {
    navigate("/admin/" + ADMIN_PATHS.BOOKING_CREATE);
  };
  const [tab, setTab] = useState<BookingStatus | "all">("all");
  const [data, setData] = useState<Booking[]>([]);

  
  const fetchBookings = async (status?: BookingStatus) => {
    try {
      // const response = await getBookings(status);
      // setData(response);
      let filteredBookings = mockBookings;
      if (status !== undefined) {
        filteredBookings = mockBookings.filter((booking) => booking.status === status);
      }
      setData(filteredBookings);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
    }
  };

  const handleSearch = (input: string) => {
    console.log("Tìm kiếm:", input);
  };

  const handleTabChange = (selectedTab: BookingStatus | "all") => {
    console.log(selectedTab);
    
    setTab(selectedTab);
    fetchBookings(selectedTab === "all" ? undefined : selectedTab);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Container
      title="Danh sách đặt phòng"
      linkToBack="/admin"
      titleToBack="Quay trở lại trang admin"
      fullscreen
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Tạo đặt phòng"
          onClick={handleBooking}
        />
      }
    >
      <div className={cx("booking-box")}>
        <OptionBar>
          <OptionItem
            title="Tất cả"
            onClick={() => handleTabChange("all")}
            active={tab === "all"}
          />
          {Object.keys(BOOKING_STATUS).map((statusKey) => (
            <OptionItem
              key={statusKey}
              title={BOOKING_STATUS[statusKey as keyof typeof BOOKING_STATUS]}
              onClick={() => handleTabChange(statusKey as BookingStatus)}
              active={tab === statusKey}
            />
          ))}
        </OptionBar>
        <div className={cx("search")}>
          <Search placeholder="Tìm kiếm booking" onSearch={handleSearch} />
        </div>
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem" }}
            rows={data}
            columns={bookingColumns}
            rowCount={10}
            disableColumnMenu
            className={cx("data")}
            disableColumnSorting={true}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default Bookings;
