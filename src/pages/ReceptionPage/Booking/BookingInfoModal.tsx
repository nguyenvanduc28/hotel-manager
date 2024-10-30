import React from "react";
import { Dialog, Typography } from "@mui/material"; // Giả sử bạn sử dụng react-modal
import classNames from "classnames/bind";
import styles from "./BookingInfoModal.module.scss";
import { Booking } from "../../../types/hotel";
import moment from "moment";
import {
  BOOKING_STATUS,
  BookingStatus,
} from "../../../constants/admin/constants";
import { CloseOutlined } from "@mui/icons-material";

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
  const handleConfirm = () => {
    // Thêm logic để xử lý khi xác nhận
    onReload();
  };

  const handleCheckIn = () => {
    // Thêm logic để xử lý khi checkin
    onReload();
  };

  const handleCheckOut = () => {
    // Thêm logic để xử lý khi checkout
    onReload();
  };

  const handleCancel = () => {
    // Thêm logic để xử lý khi hủy
    onReload();
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

  return (
    <Dialog open={open} onClose={onClose}>
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
                  )}{" "} vnđ
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
              <button
                onClick={handleConfirm}
                className={cx("action-button", "action-button--confirm")}
              >
                Xác nhận
              </button>
            )}

            {bookingData.status === BOOKING_STATUS.Confirmed && (
              <button
                onClick={handleCheckIn}
                className={cx("action-button", "action-button--checkin")}
              >
                Checkin
              </button>
            )}

            {bookingData.status === BOOKING_STATUS.CheckedIn && (
              <button
                onClick={handleCheckOut}
                className={cx("action-button", "action-button--checkout")}
              >
                Checkout
              </button>
            )}

            {bookingData.status === BOOKING_STATUS.Pending && (
              <button
                onClick={handleCancel}
                className={cx("action-button", "action-button--cancel")}
              >
                Hủy đặt phòng
              </button>
            )}

            {/* Nút thêm dịch vụ có thể thêm sau này */}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BookingInfoModal;
