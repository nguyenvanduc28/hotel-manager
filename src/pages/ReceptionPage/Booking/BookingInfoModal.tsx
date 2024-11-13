import React, { useState } from "react";
import { Dialog, Typography, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material"; // Giả sử bạn sử dụng react-modal
import classNames from "classnames/bind";
import styles from "./BookingInfoModal.module.scss";
import { Booking } from "../../../types/hotel";
import moment from "moment";
import {
  BOOKING_STATUS,
  BookingStatus,
} from "../../../constants/admin/constants";
import { CloseOutlined } from "@mui/icons-material";
import {
  checkInBooking,
  confirmBooking,
  unConfirmBooking,
  unCheckInBooking,
} from "../../../apis/bookingApis/bookingApis";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
interface BookingInfoModalProps {
  open: boolean;
  onClose: () => void;
  bookingData: Booking;
  onReload: () => void;
}

const BookingInfoModal: React.FC<BookingInfoModalProps> = ({
  open,
  onClose,
  bookingData,
  onReload,
}) => {
  const navigate = useNavigate();
  const requestConfirmBooking = async (bookingId: number) => {
    try {
      await confirmBooking(bookingId);
    } catch (error) {
      console.log("Lỗi xác nhận đặt phòng", error);
    }
  };
  const requestCheckinBooking = async (bookingId: number) => {
    try {
      await checkInBooking(bookingId);
    } catch (error) {
      console.log("Lỗi checkin", error);
    }
  };

  const requestUnconfirmBooking = async (bookingId: number) => {
    try {
      await unConfirmBooking(bookingId);
      onReload();
      onClose();
    } catch (error) {
      console.log("Lỗi hủy xác nhận đặt phòng", error);
    }
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    action: () => {},
  });

  const handleConfirm = () => {
    setConfirmDialog({
      open: true,
      title: "Xác nhận đặt phòng",
      message: "Bạn có chắc chắn muốn xác nhận đặt phòng này?",
      action: async () => {
        try {
          await requestConfirmBooking(bookingData.id);
          onReload();
          onClose();
        } catch (error) {
          console.error("Lỗi xác nhận đặt phòng:", error);
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleCheckIn = () => {
    setConfirmDialog({
      open: true,
      title: "Xác nhận check-in",
      message: "Bạn có chắc chắn muốn check-in cho đặt phòng này?",
      action: async () => {
        try {
          await requestCheckinBooking(bookingData.id);
          onReload();
          onClose();
        } catch (error) {
          console.error("Lỗi checkin:", error);
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };



  const handleCheckOut = () => {
    navigate("/reception/checkout/"+ bookingData.id.toString());
    onClose();
  };

  const handleCancel = () => {
    // Thêm logic để xử lý khi hủy
    onReload();
  };

  const handlePayment = () => {
    navigate("/reception/checkout/"+ bookingData.id.toString()+"/payment");
    onClose();
  };

  const statusStyles: Record<BookingStatus, React.CSSProperties> = {
    [BOOKING_STATUS.Confirmed]: { color: "green" },
    [BOOKING_STATUS.CheckedIn]: { color: "blue" },
    [BOOKING_STATUS.CheckedOut]: { color: "gray" },
    [BOOKING_STATUS.Canceled]: { color: "red" },
    [BOOKING_STATUS.Pending]: { color: "orange" },
    [BOOKING_STATUS.Completed]: { color: "purple" },
    [BOOKING_STATUS.NoShow]: { color: "brown" },
    [BOOKING_STATUS.AwaitingPayment]: { color: "darkorange" },
    [BOOKING_STATUS.Refunded]: { color: "pink" },
  };

  const currentStatusStyle: React.CSSProperties = statusStyles[
    bookingData.status
  ] || { color: "black" };

  const isWithinTimeLimit = (timestamp?: number) => {
    if (!timestamp) return false;
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    const timeDifference = currentTime - timestamp;
    return timeDifference <= 600; // 10 minutes = 600 seconds
  };

  const handleUnCheckIn = () => {
    setConfirmDialog({
      open: true,
      title: "Hủy check-in",
      message: "Bạn có chắc chắn muốn hủy check-in cho đặt phòng này?",
      action: async () => {
        try {
          await unCheckInBooking(bookingData.id);
          onReload();
          onClose();
        } catch (error) {
          console.error("Lỗi hủy check-in:", error);
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleUnconfirm = () => {
    setConfirmDialog({
      open: true,
      title: "Hủy xác nhận",
      message: "Bạn có chắc chắn muốn hủy xác nhận đặt phòng này?",
      action: async () => {
        try {
          await unConfirmBooking(bookingData.id);
          onReload();
          onClose();
        } catch (error) {
          console.error("Lỗi hủy xác nhận đặt phòng:", error);
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  return (
    <>
      <Dialog sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgb(0 0 0 / 0.3)'
        }
        }} 
        open={open} 
        onClose={onClose}
      >
        <div className={cx("modal")}>
          <div className={cx("modal-header")}>
            <Typography variant="h3" sx={{ ...currentStatusStyle, mb: 2 }}>
              {bookingData.status.toUpperCase()}
            </Typography>
            <button onClick={onClose} className={cx("close-button")}>
              <CloseOutlined />
            </button>
          </div>
          <div className={cx("modal-content")}>
            <div className={cx("booking-info")}>
              <div
                className={cx("info-item")}
                style={{ justifyContent: "center" }}
              >
                <span className={cx("item-title")} style={{ fontSize: "1.8rem" }}>
                  Thông tin đặt phòng
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Họ và tên:</span>
                <span className={cx("item-value")}>
                  {bookingData.customer.name ? bookingData.customer.name : "..."}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Email:</span>
                <span className={cx("item-value")}>
                  {bookingData.customer.email
                    ? bookingData.customer.email
                    : "..."}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Số điện thoại:</span>
                <span className={cx("item-value")}>
                  {bookingData.customer.phoneNumber
                    ? bookingData.customer.phoneNumber
                    : "..."}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Địa chỉ:</span>
                <span className={cx("item-value")}>
                  {bookingData.customer.address
                    ? bookingData.customer.address
                    : "..."}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Ngày đặt:</span>
                <span className={cx("item-value")}>
                  {bookingData.bookingDate
                    ? moment.unix(bookingData.bookingDate).format("YYYY-MM-DD")
                    : ""}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Ngày nhận phòng:</span>
                <span className={cx("item-value")}>
                  14:00{" "}
                  {bookingData.checkInDate
                    ? moment.unix(bookingData.checkInDate).format("YYYY-MM-DD")
                    : ""}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Ngày trả phòng:</span>
                <span className={cx("item-value")}>
                  12:00{" "}
                  {bookingData.checkOutDate
                    ? moment.unix(bookingData.checkOutDate).format("YYYY-MM-DD")
                    : ""}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Tổng số đêm:</span>
                <span className={cx("item-value")}>
                  {bookingData.checkInDate && bookingData.checkOutDate
                    ? moment
                        .unix(bookingData.checkOutDate)
                        .diff(moment.unix(bookingData.checkInDate), "days")
                    : 0}{" "}
                  đêm
                </span>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Tổng số người:</span>
                <span className={cx("item-value")}>
                  {bookingData.numberOfAdults} người lớn,{" "}
                  {bookingData.numberOfChildren} trẻ em
                </span>
              </div>

              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Phòng đã đặt:</span>
                <div className={cx("item-rooms")}>
                  {bookingData.rooms.map((room, index) => (
                    <div key={index} className={cx("room-item")}>
                      <span className={cx("room-title")}>
                        Phòng {room.roomNumber} - {room.roomType?.name}
                      </span>
                      <div className={cx("room-details")}>
                        <span className={cx("room-detail")}>
                          Giá cơ bản:{" "}
                          {room.roomType?.basePricePerNight &&
                            new Intl.NumberFormat("vi-VN").format(
                              room.roomType?.basePricePerNight
                            )}{" "}
                          VND x{" "}
                          {bookingData.checkInDate && bookingData.checkOutDate
                            ? moment
                                .unix(bookingData.checkOutDate)
                                .diff(
                                  moment.unix(bookingData.checkInDate),
                                  "days"
                                )
                            : 0}
                          đêm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={cx("info-item")}>
                <span className={cx("item-title")}>Số tiền đặt cọc:</span>
                <span className={cx("item-value")}>
                  {bookingData.deposit &&
                    new Intl.NumberFormat("vi-VN").format(
                      bookingData.deposit
                    )}{" "}
                  vnđ
                </span>
              </div>
              <div className={cx("info-item", "total-cost")}>
                <span className={cx("item-title", "total-cost-title")}>
                  Tổng tiền đặt phòng:
                </span>
                <span className={cx("item-value", "total-cost-value")}>
                  {bookingData.totalCost &&
                    new Intl.NumberFormat("vi-VN").format(
                      bookingData.totalCost
                    )}{" "}
                  VND
                </span>
              </div>
            </div>
            <div className={cx("action-buttons")}>
              {bookingData.status === BOOKING_STATUS.Pending && (
                <button className={cx("action-button", "action-button--confirm")} onClick={handleConfirm}>
                  Xác nhận
                </button>
              )}
              {bookingData.status === BOOKING_STATUS.Confirmed && 
               isWithinTimeLimit(bookingData.confirmedTime) && (
                <button 
                  className={cx("action-button", "action-button--unconfirm")} 
                  onClick={handleUnconfirm}
                >
                  Hủy xác nhận
                </button>
              )}
              {bookingData.status === BOOKING_STATUS.Confirmed && (
                <button className={cx("action-button", "action-button--checkin")} onClick={handleCheckIn}>
                  Checkin
                </button>
              )}
              {bookingData.status === BOOKING_STATUS.CheckedIn && 
               isWithinTimeLimit(bookingData.checkInTime) && (
                <button 
                  className={cx("action-button", "action-button--uncheckin")} 
                  onClick={handleUnCheckIn}
                >
                  Hủy check-in
                </button>
              )}
              {bookingData.status === BOOKING_STATUS.Pending || bookingData.status === BOOKING_STATUS.Confirmed && (
                <button className={cx("action-button", "action-button--cancel")} onClick={handleCancel}>
                  Hủy đặt phòng
                </button>
              )}

              {bookingData.status === BOOKING_STATUS.CheckedIn && (
                <button className={cx("action-button", "action-button--checkout")} onClick={handleCheckOut}>
                  Checkout
                </button>
              )}
              {bookingData.status === BOOKING_STATUS.CheckedOut || bookingData.status === BOOKING_STATUS.AwaitingPayment && (
                <button className={cx("action-button", "action-button--payment")} onClick={handlePayment}>
                  Thanh toán
                </button>
              )}
              {bookingData.status === BOOKING_STATUS.Completed && (
                <button className={cx("action-button", "action-button--completed")} disabled>
                  Hoàn tất
                </button>
              )}
              {bookingData.status === BOOKING_STATUS.Canceled && (
                <button className={cx("action-button", "action-button--canceled")} disabled>
                  Đã hủy
                </button>
              )}

              

              
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        hideBackdrop
      >
        <DialogTitle sx={{ fontSize: '1.6rem' }}>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.4rem' }}>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            color="primary"
            sx={{ fontSize: '1.4rem' }}
          >
            Hủy
          </Button>
          <Button 
            onClick={() => confirmDialog.action()} 
            color="primary" 
            autoFocus
            sx={{ fontSize: '1.4rem' }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookingInfoModal;
