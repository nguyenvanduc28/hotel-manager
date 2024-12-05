import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Payment.module.scss";
import { Booking, Invoice, BookingService } from "../../../types/hotel";
import Container from "../../../components/Container/Container";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../../apis/bookingApis/bookingApis";
import { checkInvoiceExistsByBookingId, getInvoiceByBookingId } from "../../../apis/invoiceApis/invoiceApis";
import moment from "moment";
import { CreditCard } from "@mui/icons-material";
import { createInvoice } from "../../../apis/invoiceApis/invoiceApis";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const cx = classNames.bind(styles);

// Add these utility functions before the Payment component
const calculateNightCount = (checkIn?: number, checkOut?: number): number => {
  if (!checkIn || !checkOut) return 0;
  return moment.unix(checkOut).diff(moment.unix(checkIn), "days");
};

const formatDateTime = (
  timestamp?: number,
  format: string = "DD/MM/YYYY"
): string => {
  return timestamp ? moment.unix(timestamp).format(format) : "";
};

// Add these calculation functions before the Payment component
const calculateRoomTotal = (
  rooms: Booking["rooms"],
  checkIn?: number,
  checkOut?: number
): number => {
  return (
    rooms?.reduce(
      (total, room) =>
        total +
        (room.roomType?.priceToday || room.roomType?.basePricePerNight || 0) *
          calculateNightCount(checkIn, checkOut),
      0
    ) || 0
  );
};

const calculateConsumablesTotal = (
  consumables: Booking["consumablesUsed"]
): number => {
  return (
    consumables?.reduce((total, item) => total + (item.totalPrice || 0), 0) ||
    0
  );
};

const calculateDamageTotal = (
  damages: Booking["equipmentDamagedList"]
): number => {
  return (
    damages?.reduce((total, item) => total + (item.damageFee || 0), 0) || 0
  );
};

// Thêm hàm tính tổng tiền dịch vụ
const calculateServiceItemsTotal = (bookingService?: BookingService): number => {
  if (!bookingService?.serviceOrders) return 0;
  
  return bookingService.serviceOrders.reduce((orderTotal, order) => {
    const orderItemsTotal = order.orderItems.reduce((itemTotal, item) => {
      return itemTotal + (item.totalPrice || 0);
    }, 0);
    return orderTotal + orderItemsTotal;
  }, 0);
};

// Cập nhật hàm calculateGrandTotal để sử dụng calculateServiceItemsTotal
const calculateGrandTotal = (booking: Booking): number => {
  if (!booking) return 0;
  return (
    calculateRoomTotal(
      booking.rooms,
      booking.checkInDate,
      booking.checkOutDate
    ) +
    calculateConsumablesTotal(booking.consumablesUsed) +
    calculateServiceItemsTotal(booking.servicesUsed) +
    calculateDamageTotal(booking.equipmentDamagedList) -
    (booking.deposit || 0)
  );
};

const formatCurrency = (amount?: number): string => {
  return `${(amount || 0).toLocaleString()} VND`;
};

const Payment = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceExists, setInvoiceExists] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const fetchBooking = async () => {
    try {
      if (!id) return;
      const data = await getBookingById(parseInt(id));
      setBooking(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch booking"
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchInvoice = async () => {
    try {
      if (!id) return;
      const data = await getInvoiceByBookingId(parseInt(id));
      setInvoice(data);
      setBooking(data.booking);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch invoice"
      );
    } finally {
      setLoading(false);
    }
  };
  const checkInvoiceExists = async () => {
    if (!id) return;
    const data = await checkInvoiceExistsByBookingId(parseInt(id));
    setInvoiceExists(data);
    if (data) fetchInvoice();
    else fetchBooking();
  };

  useEffect(() => {
    checkInvoiceExists();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!booking) return <div>No booking found</div>;

  const handleCreateInvoice = async () => {
    await createInvoice(booking);
  };

  const handlePaymentClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmPayment = async () => {
    await handleCreateInvoice();
    navigate(`/reception/booking/list`);
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  return (
    <Container
      fullscreen
      title="Thanh toán"
      linkToBack={invoiceExists ? `/reception/invoice/list` : `/reception/checkout/${id}`}
      titleToBack={invoiceExists ? "Quay lại danh sách hóa đơn" : "Quay lại màn hình checkout"}
    >
      <div className={cx("payment-content")}>
        <div className={cx("checkout-content")}>
          {/* Mã đặt phòng */}
          <div className={cx("checkout-content-item", "booking-id")}>
            <div className={cx("checkout-content-item-title")}>
              Mã đặt phòng - #{booking.id} {invoiceExists ? <span className={cx("invoice-exists")}>(Đã thanh toán)</span> : ""}
            </div>
          </div>
          {/* Thông tin khách hàng */}
          <div className={cx("checkout-content-item")}>
            <div className={cx("checkout-content-item-title")}>
              Thông tin khách hàng
            </div>
            <div className={cx("checkout-content-item-content")}>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Họ tên:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.customer.name}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Giới tính:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.customer.gender}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Quốc tịch:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.customer.nationality}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Số điện thoại:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.customer.phoneNumber}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Email:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.customer.email}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Địa chỉ:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.customer.address}
                </div>
              </div>
            </div>
          </div>
          {/* Thông tin phòng */}
          <div className={cx("checkout-content-item")}>
            <div className={cx("checkout-content-item-title")}>
              Thông tin phòng
            </div>
            <div className={cx("checkout-content-item-content")}>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Tổng số người:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.numberOfAdults +
                    " người lớn, " +
                    booking.numberOfChildren +
                    " trẻ em"}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Thời gian lưu trú:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {formatDateTime(booking.checkInDate) +
                    " - " +
                    formatDateTime(booking.checkOutDate)}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Tổng số đêm:  
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {calculateNightCount(
                    booking.checkInDate,
                    booking.checkOutDate
                  )}{" "}
                  đêm
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Thời gian checkin:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {formatDateTime(booking.checkInTime, "HH:mm DD/MM/YYYY")}
                </div>
              </div>
              <div className={cx("checkout-content-item-content-item")}>
                <div className={cx("checkout-content-item-content-item-label")}>
                  Phòng đã đặt:
                </div>
                <div className={cx("checkout-content-item-content-item-value")}>
                  {booking.rooms.map((room, index) => (
                    <div key={index} className={cx("room-item")}>
                      <div className={cx("room-image-wrapper")}>
                        <img 
                          src={room.imageList?.[0].url || '/default-room.png'} 
                          alt={room.roomType?.name} 
                          className={cx("room-image")}
                        />
                      </div>
                      <div className={cx("room-info")}>
                        <span className={cx("room-title")}>
                          Phòng {room.roomNumber} - {room.roomType?.name}
                        </span>
                        <div className={cx("room-details")}>
                          <span className={cx("room-detail")}>
                            Giá phòng: {room.roomType?.priceToday ? room.roomType?.priceToday.toLocaleString() : room.roomType?.basePricePerNight?.toLocaleString()} VND x {calculateNightCount(booking.checkInDate, booking.checkOutDate)} đêm
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách vật phẩm sử dụng */}
          <div className={cx("checkout-content-item")}>
            <div className={cx("checkout-content-item-title")}>
              Danh sách vật phẩm sử dụng
            </div>
            <div className={cx("checkout-content-item-content")}>
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
                  {booking?.consumablesUsed &&
                  booking.consumablesUsed.length > 0 ? (
                    booking.consumablesUsed?.map((item, index) => (
                      <tr key={index} className={cx("table-row")}>
                        <td className={cx("table-cell")}>
                          {item.consumableId}
                        </td>
                        <td className={cx("table-cell")}>{item.name}</td>
                        <td className={cx("table-cell")}>
                          {item.consumableCategory?.name}
                        </td>
                        <td className={cx("table-cell")}>
                          {item.quantityUsed}
                        </td>
                        <td className={cx("table-cell", "price-cell")}>
                          {item.totalPrice?.toLocaleString()} VND
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={cx("table-row")}>
                      <td
                        colSpan={6}
                        className={cx("table-cell", "empty-cell")}
                      >
                        Không có đồ dùng sử dụng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danh sách dịch vụ đã sử dụng */}
          <div className={cx("checkout-content-item")}>
            <div className={cx("checkout-content-item-title")}>
              Danh sách dịch vụ đã sử dụng
            </div>
            <div className={cx("checkout-content-item-content")}>
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
                  {booking.servicesUsed && booking.servicesUsed.serviceOrders.length === 0 && (
                    <tr className={cx("table-row")}>
                      <td className={cx("table-cell")} colSpan={7}>Không có dịch vụ nào</td>
                    </tr>
                  )}
                  {booking.servicesUsed?.serviceOrders?.map((order, orderIndex) => (
                    <>
                      {/* Order header row */}
                      <tr key={`order-${orderIndex}`} className={cx("table-row", "order-header")}>
                        <td className={cx("table-cell")} colSpan={7} style={{ backgroundColor: '#f5f5f5' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
                            <span style={{ fontStyle: 'italic' }}>Đơn hàng #{order.id} - {moment.unix(order.orderCreatedAt || 0).format("HH:mm DD/MM/YYYY")}</span>
                            <span style={{ fontStyle: 'italic' }}>Trạng thái: {order.status}</span>
                          </div>
                        </td>
                      </tr>
                      {/* Order items */}
                      {order.orderItems.map((item, itemIndex) => (
                        <tr key={`order-${orderIndex}-item-${itemIndex}`} className={cx("table-row")}>
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
                          <td className={cx("table-cell")}>{order.note || "-"}</td>
                          <td className={cx("table-cell", "price-cell")}>
                            {formatCurrency(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danh sách đồ dùng hỏng */}
          <div className={cx("checkout-content-item")}>
            <div className={cx("checkout-content-item-title")}>
              Danh sách thiết bị hư hỏng
            </div>
            <div className={cx("checkout-content-item-content")}>
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
                  {booking?.equipmentDamagedList &&
                  booking.equipmentDamagedList.length > 0 ? (
                    booking.equipmentDamagedList?.map((item, index) => (
                      <tr key={index} className={cx("table-row")}>
                        <td className={cx("table-cell")}>{item.equipmentId}</td>
                        <td className={cx("table-cell")}>{item.name}</td>
                        <td className={cx("table-cell")}>
                          {item.equipmentCategory?.name}
                        </td>
                        <td className={cx("table-cell")}>
                          {item.damageDescription}
                        </td>
                        <td className={cx("table-cell", "price-cell")}>
                          {item.damageFee?.toLocaleString()} VND
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className={cx("table-row")}>
                      <td
                        colSpan={6}
                        className={cx("table-cell", "empty-cell")}
                      >
                        Không có thiết bị hư hỏng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Thông tin tổng tiền thanh toán */}
        <div className={cx("payment-summary")}>
          <div className={cx("summary-section")}>
            <div className={cx("section-header")}>
              <h3 className={cx("section-title", "summary-title")}>Tổng tiền</h3>
            </div>
            <div className={cx("section-content")}>
              <div className={cx("total-summary")}>
                <div className={cx("summary-row")}>
                  <span className={cx("summary-label")}>Tổng tiền phòng:</span>
                  <span className={cx("summary-value")}>
                    {formatCurrency(
                      calculateRoomTotal(
                        booking?.rooms || [],
                        booking?.checkInDate,
                        booking?.checkOutDate
                      )
                    )}
                  </span>
                </div>
                <div className={cx("summary-row")}>
                  <span className={cx("summary-label")}>
                    Tổng tiền đồ dùng tiêu hao:
                  </span>
                  <span className={cx("summary-value")}>
                    {formatCurrency(
                      calculateConsumablesTotal(booking?.consumablesUsed)
                    )}
                  </span>
                </div>
                <div className={cx("summary-row")}>
                  <span className={cx("summary-label")}>Tổng tiền bồi thường:</span>
                  <span className={cx("summary-value")}>
                    {formatCurrency(
                      calculateDamageTotal(booking?.equipmentDamagedList)
                    )}
                  </span>
                </div>
                <div className={cx("summary-row")}>
                  <span className={cx("summary-label")}>Tổng tiền dịch vụ:</span>
                  <span className={cx("summary-value")}>
                    {formatCurrency(calculateServiceItemsTotal(booking?.servicesUsed))}
                  </span>
                </div>
                <div className={cx("summary-row")}>
                  <span className={cx("summary-label")}>Tiền cọc:</span>
                  <span className={cx("summary-value", "deposit")}>
                    - {formatCurrency(booking?.deposit)}
                  </span>
                </div>
                <div className={cx("summary-row", "total")}>
                  <span className={cx("summary-label")}>Tổng cộng:</span>
                  <span className={cx("summary-value")}>
                    {formatCurrency(calculateGrandTotal(booking))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("payment-input")}>
            <div className={cx("input-group")}>
              <label htmlFor="customerPayment" className={cx("input-label")}>
                Số tiền khách trả:
              </label>
              <input
                type="text"
                id="customerPayment"
                className={cx("payment-amount-input")}
                value={invoiceExists ? invoice?.totalAmount?.toLocaleString() : calculateGrandTotal(booking).toLocaleString()}
                placeholder="Số tiền khách trả"
                disabled={invoiceExists}
              />
            </div>
            {invoiceExists && (
              <div className={cx("payment-info")}>
                <div className={cx("payment-info-item")}>
                  <span className={cx("payment-info-label")}>Ngày thanh toán:</span>
                  <span className={cx("payment-info-value")}>{formatDateTime(invoice?.issueDate, "HH:mm DD/MM/YYYY")}</span>
                </div>
                <div className={cx("payment-info-item")}>
                  <span className={cx("payment-info-label")}>Trạng thái:</span>
                  <span className={cx("payment-info-value")}>{invoice?.paymentStatus}</span>
                </div>
              </div>
            )}
            {invoiceExists ? (
              <div className={cx("payment-button", "disabled")}>
                <CreditCard className={cx("payment-icon")} />
                Đã thanh toán
              </div>
            ) : (
              <button 
                className={cx("payment-button")} 
                onClick={handlePaymentClick}
              >
                <CreditCard className={cx("payment-icon")} />
                Thanh toán
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgb(0 0 0 / 0.3)',
          '& .MuiDialogTitle-root': { fontSize: '1.6rem' }
          }
        }}
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận thanh toán
        </DialogTitle>
        <DialogContent sx={{ fontSize: '1.4rem' }}>
          Bạn có chắc chắn muốn thanh toán số tiền {formatCurrency(calculateGrandTotal(booking!))}?
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            sx={{ fontSize: '1.3rem' }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmPayment} 
            variant="contained" 
            autoFocus
            sx={{ fontSize: '1.3rem' }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Payment;
