import { useState, useEffect, useCallback } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Container from "../../../components/Container/Container";
import OptionBar from "../../../components/OptionBar/OptionBar";
import OptionItem from "../../../components/OptionBar/OptionItem";
import Search from "../../../components/Search/Search";
import { StyledChip } from "../../../components/StyledChip/StyledChip";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./BookingList.module.scss";
import classNames from "classnames/bind";
import {
  BOOKING_STATUS,
  BookingStatus,
} from "../../../constants/admin/constants";
import { Booking } from "../../../types/hotel";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  searchBooking,
  searchBookingByCusName,
} from "../../../apis/bookingApis/bookingApis";
import ColumnFilter from "../../../components/ColumnFilter/ColumnFilter";
import BookingInfoModal from "./BookingInfoModal";
import Loading from "../../../components/Loading/Loading";
import ServiceModal from "../../../components/ServiceModal/ServiceModal";
import { Button } from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';


const cx = classNames.bind(styles);
const statusStyles: Record<BookingStatus, React.CSSProperties> = {
  [BOOKING_STATUS.Confirmed]: { backgroundColor: "green", color: "white" },
  [BOOKING_STATUS.CheckedIn]: { backgroundColor: "blue", color: "white" },
  [BOOKING_STATUS.CheckedOut]: { backgroundColor: "gray", color: "white" },
  [BOOKING_STATUS.Canceled]: { backgroundColor: "red", color: "white" },
  [BOOKING_STATUS.Pending]: { backgroundColor: "orange", color: "black" },
  [BOOKING_STATUS.Completed]: { backgroundColor: "purple", color: "white" },
  [BOOKING_STATUS.NoShow]: { backgroundColor: "brown", color: "white" },
  [BOOKING_STATUS.AwaitingPayment]: {
    backgroundColor: "darkorange",
    color: "white",
  },
  [BOOKING_STATUS.Refunded]: { backgroundColor: "pink", color: "black" },
};



const BookingList = () => {
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
      field: "customerName",
      headerName: "Tên khách hàng",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Tên khách hàng</span>,
      renderCell: (params) => <span>{params.row.customer?.name || "_"}</span>,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Trạng thái</span>,
      renderCell: (params) => {
        const status = params.row.status as BookingStatus;
        return (
          <StyledChip
            label={status}
            style={statusStyles[status]}
            // variant="outlined"
          />
        );
      },
    },
    {
      field: "checkInDate",
      headerName: "Ngày nhận phòng",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Ngày nhận phòng</span>,
      renderCell: (params) => {
        const checkInDate = params.row.checkInDate;
        return (
          <span>
            {checkInDate ? moment.unix(checkInDate).format("DD/MM/YYYY") : "_"}
          </span>
        );
      },
    },
    {
      field: "checkOutDate",
      headerName: "Ngày trả phòng",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Ngày trả phòng</span>,
      renderCell: (params) => {
        const checkOutDate = params.row.checkOutDate;
        return (
          <span>
            {checkOutDate
              ? moment.unix(checkOutDate).format("DD/MM/YYYY")
              : "_"}
          </span>
        );
      },
    },
    {
      field: "totalCost",
      headerName: "Tổng chi phí",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Tổng chi phí</span>,
      renderCell: (params) => (
        <span>
          {params.row.totalCost
            ? `${params.row.totalCost.toLocaleString()} đ`
            : "_"}
        </span>
      ),
    },
    {
      field: "deposit",
      headerName: "Tiền cọc",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Tiền cọc</span>,
      renderCell: (params) => (
        <span>
          {params.row.deposit ? `${params.row.deposit.toLocaleString()} đ` : 0}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 0.7,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "center",
      align: "center",
      renderHeader: () => <span>Thao tác</span>,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenServiceModal(params.row);
          }}
          style={{ fontSize: "1.2rem" }}
          startIcon={<AddBusinessIcon />}
        >
          Dịch vụ
        </Button>
      ),
    },
  ];
  
  const hiddenColumns: GridColDef[] = [
    {
      field: "bookingDate",
      headerName: "Ngày đặt",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Ngày đặt</span>,
      renderCell: (params) => {
        const bookingDate = params.row.bookingDate;
        return (
          <span>
            {bookingDate ? moment.unix(bookingDate).format("HH:mm DD.MM.YYYY") : "_"}
          </span>
        );
      },
    },
    {
      field: "estimatedArrivalTime",
      headerName: "Thời gian đến dự kiến",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Thời gian đến dự kiến</span>,
      renderCell: (params) => {
        const arrivalTime = params.row.estimatedArrivalTime;
        return (
          <span>
            {arrivalTime ? moment.unix(arrivalTime).format("HH:mm DD.MM.YYYY") : "_"}
          </span>
        );
      },
    },
    {
      field: "checkInTime",
      headerName: "Thời gian check-in",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Thời gian check-in</span>,
      renderCell: (params) => {
        const checkInTime = params.row.checkInTime;
        return (
          <span>
            {checkInTime ? moment.unix(checkInTime).format("HH:mm DD.MM.YYYY") : "_"}
          </span>
        );
      },
    },
    {
      field: "checkOutTime",
      headerName: "Thời gian check-out",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Thời gian check-out</span>,
      renderCell: (params) => {
        const checkOutTime = params.row.checkOutTime;
        return (
          <span>
            {checkOutTime ? moment.unix(checkOutTime).format("HH:mm DD.MM.YYYY") : "_"}
          </span>
        );
      },
    },
    {
      field: "numberOfAdults",
      headerName: "Số người lớn",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Số người lớn</span>,
      renderCell: (params) => <span>{params.row.numberOfAdults}</span>,
    },
    {
      field: "numberOfChildren",
      headerName: "Số trẻ em",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Số trẻ em</span>,
      renderCell: (params) => <span>{params.row.numberOfChildren}</span>,
    },
    // {
    //   field: "isGroup",
    //   headerName: "Đặt nhóm",
    //   flex: 1,
    //   headerClassName: "datagrid-header",
    //   cellClassName: "datagrid-cell",
    //   headerAlign: "left",
    //   renderHeader: () => <span>Đặt nhóm</span>,
    //   renderCell: (params) => <span>{params.row.isGroup ? "Có" : "Không"}</span>,
    // },
    {
      field: "isGuaranteed",
      headerName: "Đảm bảo đặt phòng",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span>Đảm bảo đặt phòng</span>,
      renderCell: (params) => (
        <span>
          {params.row.isGuaranteed ? (
            <span>
              <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
            </span>
          ) : (
            <span>
              <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
            </span>
          )}
        </span>
      ),
    },
  ];
  const navigate = useNavigate();
  const [tab, setTab] = useState<BookingStatus | "all">("all");
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] =
    useState<GridColDef[]>(defaultColumns);
  const [openRow, setOpenRow] = useState<boolean>(false);
  const [rowSelected, setSelectedRoom] = useState<Booking>({
    id: 0,
    customer: { id: 0 },
    checkInDate: undefined,
    checkOutDate: undefined,
    bookingDate: Date.now() / 1000,
    estimatedArrivalTime: undefined,
    isGroup: false,
    totalCost: 0,
    status: BOOKING_STATUS.Pending,
    deposit: 0,
    cancellationPolicy: "Miễn phí hủy trong 12h",
    canceledAt: undefined,
    isGuaranteed: true,
    numberOfAdults: 2,
    numberOfChildren: 0,
    rooms: [],
  });
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async (status: string) => {
    try {
      setLoading(true);
      const response = await searchBooking(status);
      setData(response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBookingsByCusname = async (cusName: string) => {
    try {
      const response = await searchBookingByCusName(cusName);
      setData(response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (input: string) => {
    fetchBookingsByCusname(input);
  };

  const handleTabChange = (selectedTab: BookingStatus | "all") => {
    setTab(selectedTab);
    const statusValue =
      selectedTab === "all"
        ? ""
        : `${
            BOOKING_STATUS[
              selectedTab as unknown as keyof typeof BOOKING_STATUS
            ]
          }`; // Lấy giá trị tương ứng
    fetchBookings(statusValue);
  };

  useEffect(() => {
    fetchBookings("");
  }, []);
  const handleRowClick = (params: any) => {
    setSelectedRoom(params.row);
    setOpenRow(true);
  };

  const handleReload = useCallback((tabToMove?: string) => {
    let statusKey = tabToMove;
    if (tabToMove) {
      const foundKey = Object.entries(BOOKING_STATUS).find(([key, value]) => value === tabToMove)?.[0];
      if (foundKey) {
        statusKey = foundKey;
      }
    }
    
    setTab(statusKey as BookingStatus);
    const statusValue = statusKey ? BOOKING_STATUS[statusKey as keyof typeof BOOKING_STATUS] : '';
    fetchBookings(statusValue);
  }, []);

  const handleOpenServiceModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setOpenServiceModal(false);
    setSelectedBooking(null);
  };

  return (
    <Container title="Danh sách đặt phòng" fullscreen>
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
          <Search
            placeholder="Tìm kiếm booking"
            handleSearch={(query) => {
              fetchBookingsByCusname(query);
            }}
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
                disableColumnMenu
                onRowClick={handleRowClick}
                rowSelection={false}
                hideFooterPagination
              />
            </>
          )}
        </div>
      </div>
      <BookingInfoModal
        onClose={() => setOpenRow(false)}
        bookingData={rowSelected}
        open={openRow}
        onReload={handleReload}
      />
      {selectedBooking && (
        <ServiceModal
          open={openServiceModal}
          onClose={() => handleCloseServiceModal()}
          bookingId={selectedBooking.id || 0}
          bookingServiceId={selectedBooking.servicesUsed?.id || 0}
        />
      )}
    </Container>
  );
};

export default BookingList;
