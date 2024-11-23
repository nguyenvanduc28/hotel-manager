import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Invoice, Booking, BookingServiceItem } from "../../types/hotel";
import classNames from "classnames/bind";
import styles from "./InvoiceModal.module.scss";
import moment from "moment";
import { useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Dialog as ConfirmDialog, DialogActions, DialogContent as ConfirmDialogContent, DialogTitle as ConfirmDialogTitle } from "@mui/material";

const cx = classNames.bind(styles);

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  booking: Booking;
}

const InvoiceModal = ({ open, onClose, invoice, booking }: InvoiceModalProps) => {
  // Reuse calculation functions from Checkout.tsx
  const calculateNightCount = (checkIn?: number, checkOut?: number): number => {
    if (!checkIn || !checkOut) return 0;
    return moment.unix(checkOut).diff(moment.unix(checkIn), "days");
  };

  const calculateRoomTotal = (
    rooms: Booking["rooms"],
    checkIn?: number,
    checkOut?: number
  ): number => {
    return rooms?.reduce(
      (total, room) =>
        total +
        (room.roomType?.basePricePerNight || 0) *
        calculateNightCount(checkIn, checkOut),
      0
    ) || 0;
  };

  const calculateConsumablesTotal = (consumables: Booking["consumablesUsed"]): number => {
    return consumables?.reduce((total, item) => total + (item.totalPrice || 0), 0) || 0;
  };

  const calculateDamageTotal = (damages: Booking["equipmentDamagedList"]): number => {
    return damages?.reduce((total, item) => total + (item.damageFee || 0), 0) || 0;
  };

  const calculateServiceItemsTotal = (serviceItems?: BookingServiceItem[]): number => {
    return serviceItems?.reduce((total, item) => total + (item.totalPrice || 0), 0) || 0;
  };

  const formatCurrency = (amount?: number): string => {
    return `${(amount || 0).toLocaleString('vi-VN')} VNĐ`;
  };

  const formatDateTime = (timestamp?: number): string => {
    return timestamp ? moment.unix(timestamp).format("HH:mm DD/MM/YYYY") : "_";
  };

  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [showConsumablesDetails, setShowConsumablesDetails] = useState(false);
  const [showDamageDetails, setShowDamageDetails] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleViewDetail = () => {
    if (location.pathname.includes('/admin')) {
      setShowConfirmDialog(true);
    } else {
      navigate(`/reception/checkout/${booking.id}/payment`);
    }
  };

  return (
    <>
      <Dialog 
        sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgb(0 0 0 / 0.3)'
            }
          }}
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className={cx("modal-title")}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>Hóa đơn #{invoice.id}</div>
            <Button
              onClick={handleViewDetail}
              sx={{
                textTransform: 'none',
                fontSize: '1.4rem'
              }}
            >
              Xem chi tiết
            </Button>
          </div>
        </DialogTitle>
        <DialogContent className={cx("modal-content")}>
          <div className={cx("invoice-details")}>
            {/* Basic booking info */}
            <div className={cx("detail-row")}>
              <span className={cx("label")}>Mã đặt phòng:</span>
              <span className={cx("value")}>{booking.id}</span>
            </div>

            {/* Room details section */}
            <div className={cx("detail-section")}>
              <div className={cx("detail-row", "clickable")} onClick={() => setShowRoomDetails(!showRoomDetails)}>
                <span className={cx("label")}>Tổng tiền phòng:</span>
                <span className={cx("value", "with-arrow")}>
                  {formatCurrency(calculateRoomTotal(booking.rooms, booking.checkInDate, booking.checkOutDate))}
                  <KeyboardArrowDown className={cx("arrow", { rotated: showRoomDetails })} />
                </span>
              </div>
              <div className={cx("detail-dropdown", { expanded: showRoomDetails })}>
                <table className={cx("data-table")}>
                  <thead className={cx("table-header")}>
                    <tr>
                      <th className={cx("header-cell")}>Số phòng</th>
                      <th className={cx("header-cell")}>Loại phòng</th>
                      <th className={cx("header-cell")}>Giá cơ bản</th>
                      <th className={cx("header-cell")}>Số đêm</th>
                      <th className={cx("header-cell")}>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody className={cx("table-body")}>
                    {booking.rooms.map((room, index) => (
                      <tr key={index} className={cx("table-row")}>
                        <td className={cx("table-cell")}>{room.roomNumber}</td>
                        <td className={cx("table-cell")}>{room.roomType?.name}</td>
                        <td className={cx("table-cell")}>{formatCurrency(room.roomType?.basePricePerNight)}</td>
                        <td className={cx("table-cell")}>{calculateNightCount(booking.checkInDate, booking.checkOutDate)}</td>
                        <td className={cx("table-cell", "price-cell")}>
                          {formatCurrency((room.roomType?.basePricePerNight || 0) * calculateNightCount(booking.checkInDate, booking.checkOutDate))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consumables section */}
            <div className={cx("detail-section")}>
              <div className={cx("detail-row", "clickable")} onClick={() => setShowConsumablesDetails(!showConsumablesDetails)}>
                <span className={cx("label")}>Tiền dịch vụ tiêu hao:</span>
                <span className={cx("value", "with-arrow")}>
                  {formatCurrency(calculateConsumablesTotal(booking.consumablesUsed))}
                  <KeyboardArrowDown className={cx("arrow", { rotated: showConsumablesDetails })} />
                </span>
              </div>
              <div className={cx("detail-dropdown", { expanded: showConsumablesDetails })}>
                <table className={cx("data-table")}>
                  <thead className={cx("table-header")}>
                    <tr>
                      <th className={cx("header-cell")}>Mã đồ dùng</th>
                      <th className={cx("header-cell")}>Tên đồ dùng</th>
                      <th className={cx("header-cell")}>Loại</th>
                      <th className={cx("header-cell")}>Số lượng</th>
                      <th className={cx("header-cell")}>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody className={cx("table-body")}>
                    {booking.consumablesUsed?.length === 0 && (
                      <tr className={cx("table-row")}>
                        <td className={cx("table-cell")} colSpan={5}>Không có đồ dùng nào</td>
                      </tr>
                    )}
                    {booking.consumablesUsed?.map((item, index) => (
                      <tr key={index} className={cx("table-row")}>
                        <td className={cx("table-cell")}>{item.consumableId}</td>
                        <td className={cx("table-cell")}>{item.name}</td>
                        <td className={cx("table-cell")}>{item.consumableCategory?.name}</td>
                        <td className={cx("table-cell")}>{item.quantityUsed}</td>
                        <td className={cx("table-cell", "price-cell")}>{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Damages section */}
            <div className={cx("detail-section")}>
              <div className={cx("detail-row", "clickable")} onClick={() => setShowDamageDetails(!showDamageDetails)}>
                <span className={cx("label")}>Tiền bồi thường:</span>
                <span className={cx("value", "with-arrow")}>
                  {formatCurrency(calculateDamageTotal(booking.equipmentDamagedList))}
                  <KeyboardArrowDown className={cx("arrow", { rotated: showDamageDetails })} />
                </span>
              </div>
              <div className={cx("detail-dropdown", { expanded: showDamageDetails })}>
                <table className={cx("data-table")}>
                  <thead className={cx("table-header")}>
                    <tr>
                      <th className={cx("header-cell")}>Mã thiết bị</th>
                      <th className={cx("header-cell")}>Tên thiết bị</th>
                      <th className={cx("header-cell")}>Loại</th>
                      <th className={cx("header-cell")}>Tình trạng hư hỏng</th>
                      <th className={cx("header-cell")}>Tiền bồi thường</th>
                    </tr>
                  </thead>
                  <tbody className={cx("table-body")}>
                    {booking.equipmentDamagedList?.length === 0 && (
                      <tr className={cx("table-row")}>
                        <td className={cx("table-cell")} colSpan={5}>Không có thiết bị nào</td>
                      </tr>
                    )}
                    {booking.equipmentDamagedList?.map((item, index) => (
                      <tr key={index} className={cx("table-row")}>
                        <td className={cx("table-cell")}>{item.equipmentId}</td>
                        <td className={cx("table-cell")}>{item.name}</td>
                        <td className={cx("table-cell")}>{item.equipmentCategory?.name}</td>
                        <td className={cx("table-cell")}>{item.damageDescription}</td>
                        <td className={cx("table-cell", "price-cell")}>{formatCurrency(item.damageFee)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Service Items section */}
            <div className={cx("detail-section")}>
              <div 
                className={cx("detail-row", "clickable")} 
                onClick={() => setShowServiceDetails(!showServiceDetails)}
              >
                <span className={cx("label")}>Tiền dịch vụ:</span>
                <span className={cx("value", "with-arrow")}>
                  {formatCurrency(calculateServiceItemsTotal(booking.servicesUsed))}
                  <KeyboardArrowDown className={cx("arrow", { rotated: showServiceDetails })} />
                </span>
              </div>
              <div className={cx("detail-dropdown", { expanded: showServiceDetails })}>
                <table className={cx("data-table")}>
                  <thead className={cx("table-header")}>
                    <tr>
                      <th className={cx("header-cell")}>Ảnh</th>
                      <th className={cx("header-cell")}>Tên dịch vụ</th>
                      <th className={cx("header-cell")}>Loại dịch vụ</th>
                      <th className={cx("header-cell")}>Số lượng</th>
                      <th className={cx("header-cell")}>Đơn giá</th>
                      <th className={cx("header-cell")}>Ghi chú</th>
                      <th className={cx("header-cell")}>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody className={cx("table-body")}>
                    {booking.servicesUsed?.length === 0 && (
                      <tr className={cx("table-row")}>
                        <td className={cx("table-cell")} colSpan={7}>Không có dịch vụ nào</td>
                      </tr>
                    )}
                    {booking.servicesUsed?.map((item, index) => (
                      <tr key={index} className={cx("table-row")}>
                        <td className={cx("table-cell")}>
                          <img 
                            src={item.serviceItem.image || '/placeholder-image.jpg'} 
                            alt={item.serviceItem.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </td>
                        <td className={cx("table-cell")}>{item.serviceItem.name}</td>
                        <td className={cx("table-cell")}>{item.serviceItem.serviceType.name}</td>
                        <td className={cx("table-cell")}>{item.quantity}</td>
                        <td className={cx("table-cell")}>{formatCurrency(item.serviceItem.price)}</td>
                        <td className={cx("table-cell")}>{item.note || "-"}</td>
                        <td className={cx("table-cell", "price-cell")}>
                          {formatCurrency(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment details */}
            <div className={cx("detail-row")}>
              <span className={cx("label")}>Tiền cọc:</span>
              <span className={cx("value", "deposit")}>- {formatCurrency(booking.deposit)}</span>
            </div>

            <div className={cx("detail-row", "total")}>
              <span className={cx("label")}>Tổng cộng:</span>
              <span className={cx("value")}>
                {formatCurrency(
                  calculateRoomTotal(booking.rooms, booking.checkInDate, booking.checkOutDate) +
                  calculateConsumablesTotal(booking.consumablesUsed) +
                  calculateDamageTotal(booking.equipmentDamagedList) +
                  calculateServiceItemsTotal(booking.servicesUsed) -
                  (booking.deposit || 0)
                )}
              </span>
            </div>

            <div className={cx("detail-row")}>
              <span className={cx("label")}>Đã thanh toán:</span>
              <span className={cx("value")}>{formatCurrency(invoice.totalAmount)}</span>
            </div>

            <div className={cx("detail-row")}>
              <span className={cx("label")}>Ngày thanh toán:</span>
              <span className={cx("value")}>{formatDateTime(invoice.issueDate)}</span>
            </div>

            <div className={cx("detail-row")}>
              <span className={cx("label")}>Trạng thái thanh toán:</span>
              <span className={cx("value", invoice.paymentStatus?.toLowerCase())}>
                {invoice.paymentStatus || "_"}
              </span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button style={{ fontSize: '1.4rem' }} variant="contained" onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog sx={{
        '& .MuiDialog-paper': {
          boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.1)',
        }
      }} hideBackdrop open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <ConfirmDialogTitle style={{ fontSize: '1.4rem' }}>Xác nhận chuyển trang</ConfirmDialogTitle>
        <ConfirmDialogContent style={{ fontSize: '1.4rem' }} >
          Bạn sẽ chuyển đến màn hình lễ tân
        </ConfirmDialogContent>
        <DialogActions>
          <Button style={{ fontSize: '1.4rem' }}  onClick={() => setShowConfirmDialog(false)}>Hủy</Button>
          <Button 
          style={{ fontSize: '1.4rem' }} 
            onClick={() => {
              setShowConfirmDialog(false);
              navigate(`/reception/checkout/${booking.id}/payment`);
            }}
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </ConfirmDialog>
    </>
  );
};

export default InvoiceModal; 