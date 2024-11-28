import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Checkout.module.scss";
import { Booking, BookingService } from "../../../types/hotel";
import Container from "../../../components/Container/Container";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingById } from "../../../apis/bookingApis/bookingApis";
import moment from "moment";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import {
  Add as AddIcon,
  CreditCard,
  Edit as EditIcon,
} from "@mui/icons-material";
import ConsumablesModal from "../../../components/ConsumablesModal/ConsumablesModal";
import EquipmentDamageModal from "../../../components/EquipmentDamageModal/EquipmentDamageModal";
import { checkoutBooking } from "../../../apis/bookingApis/bookingApis";
import ServiceModal from "../../../components/ServiceModal/ServiceModal";

const cx = classNames.bind(styles);

const Checkout = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConsumablesModalOpen, setIsConsumablesModalOpen] = useState(false);
  const [isEquipmentDamageModalOpen, setIsEquipmentDamageModalOpen] = useState(false);
  const [isConfirmCheckoutOpen, setIsConfirmCheckoutOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const navigate = useNavigate();
  // Fetch booking data
  useEffect(() => {
    const fetchBookingData = async () => {
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

    fetchBookingData();
  }, [id]);

  // Calculation functions
  const calculateNightCount = (checkIn?: number, checkOut?: number): number => {
    if (!checkIn || !checkOut) return 0;
    return moment.unix(checkOut).diff(moment.unix(checkIn), "days");
  };

  const calculateRoomTotal = (
    rooms: Booking["rooms"],
    checkIn?: number,
    checkOut?: number
  ): number => {
    return (
      rooms?.reduce(
        (total, room) =>
          total +
          (room.roomType?.basePricePerNight || 0) *
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

  const calculateServiceItemsTotal = (bookingService?: BookingService): number => {
    if (!bookingService?.serviceOrders) return 0;
    
    return bookingService.serviceOrders.reduce((orderTotal, order) => {
      const orderItemsTotal = order.orderItems.reduce((itemTotal, item) => {
        return itemTotal + (item.totalPrice || 0);
      }, 0);
      return orderTotal + orderItemsTotal;
    }, 0);
  };

  const calculateGrandTotal = (): number => {
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

  const formatDateTime = (
    timestamp?: number,
    format: string = "DD/MM/YYYY"
  ): string => {
    return timestamp ? moment.unix(timestamp).format(format) : "";
  };

  const formatCurrency = (amount?: number): string => {
    return `${(amount || 0).toLocaleString()} VND`;
  };

  const handleAddConsumable = () => {
    setIsConsumablesModalOpen(true);
  };



  const handleAddDamagedEquipment = () => {
    setIsEquipmentDamageModalOpen(true);
  };

  const handleServiceUpdate = (updatedServices: Booking["servicesUsed"]) => {
    if (!booking) return;
    
    setBooking({
      ...booking,
      servicesUsed: updatedServices
    });
  };

  const handleConsumablesUpdate = (updatedConsumables: Booking["consumablesUsed"]) => {
    if (!booking) return;
    
    setBooking({
      ...booking,
      consumablesUsed: updatedConsumables
    });
  };

  const handleEquipmentDamageUpdate = (updatedEquipment: Booking["equipmentDamagedList"]) => {
    if (!booking) return;
    
    setBooking({
      ...booking,
      equipmentDamagedList: updatedEquipment
    });
  };

  const handleCheckout = async () => {
    try {
      if (!booking || !id) return;

      await checkoutBooking(parseInt(id), booking);
      navigate(`/reception/checkout/${id}/payment`);
    } catch (error) {
      console.error('Checkout failed:', error);
      setError(error instanceof Error ? error.message : 'Checkout failed');
    }
  };

  const renderCustomerInfo = () => (
    <div className={cx("info-item")}>
      <div className={cx("info-item-header")}>
        <h3>Thông tin khách hàng</h3>
      </div>
      <div className={cx("info-item-content")}>
        <div className={cx("info-list")}>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Mã đặt phòng:</span>
            <span className={cx("info-value")}>{booking?.id}</span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Khách hàng:</span>
            <span className={cx("info-value")}>{booking?.customer?.name}</span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Giới tính:</span>
            <span className={cx("info-value")}>{booking?.customer?.gender}</span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Quốc tịch:</span>
            <span className={cx("info-value")}>{booking?.customer?.nationality}</span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Số điện thoại:</span>
            <span className={cx("info-value")}>
              {booking?.customer?.phoneNumber}
            </span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Email:</span>
            <span className={cx("info-value")}>{booking?.customer?.email}</span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Địa chỉ:</span>
            <span className={cx("info-value")}>
              {booking?.customer?.address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoomInfo = () => (
    <div className={cx("info-item")}>
      <div className={cx("info-item-header")}>
        <h3>Thông tin phòng</h3>
      </div>
      <div className={cx("info-item-content")}>
        <div className={cx("info-list")}>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Tổng số người:</span>
            <span className={cx("info-value")}>
              {booking?.numberOfAdults +
                " người lớn, " +
                booking?.numberOfChildren +
                " trẻ em"}
            </span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Thời gian lưu trú:</span>
            <span className={cx("info-value")}>
              {formatDateTime(booking?.checkInDate) +
                " - " +
                formatDateTime(booking?.checkOutDate)}
            </span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Tổng số đêm:</span>
            <span className={cx("info-value")}>
              {calculateNightCount(booking?.checkInDate, booking?.checkOutDate)}{" "}
              đêm
            </span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Thời gian checkin:</span>
            <span className={cx("info-value")}>
              {formatDateTime(booking?.checkInTime)}
            </span>
          </div>
          <div className={cx("info-row")}>
            <span className={cx("info-label")}>Phòng đã đặt:</span>
            <div className={cx("item-rooms")}>
              {booking?.rooms.map((room, index) => (
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
                      {calculateNightCount(
                        booking?.checkInDate,
                        booking?.checkOutDate
                      )}
                      đêm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsumablesList = () => (
    <div className={cx("checkout-section")}>
      <div className={cx("section-header")}>
        <h3 className={cx("section-title")}>Danh sách vật phẩm sử dụng</h3>
        <button className={cx("edit-button")} onClick={handleAddConsumable}>
          <EditIcon className={cx("edit-icon")} />
          <span className={cx("edit-text")}>Chỉnh sửa danh sách</span>
        </button>
      </div>
      <div className={cx("section-content")}>
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
            {booking?.consumablesUsed && booking.consumablesUsed.length > 0 ? (
              booking.consumablesUsed?.map((item, index) => (
                <tr key={index} className={cx("table-row")}>
                  <td className={cx("table-cell")}>{item.consumableId}</td>
                  <td className={cx("table-cell")}>{item.name}</td>
                  <td className={cx("table-cell")}>
                    {item.consumableCategory?.name}
                  </td>
                  <td className={cx("table-cell")}>{item.quantityUsed}</td>
                  <td className={cx("table-cell", "price-cell")}>
                    {item.totalPrice?.toLocaleString()} VND
                  </td>
                </tr>
              ))
            ) : (
              <tr className={cx("table-row")}>
                <td colSpan={6} className={cx("table-cell", "empty-cell")}>
                  Không có đồ dùng sử dụng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDamagesList = () => (
    <div className={cx("checkout-section")}>
      <div className={cx("section-header")}>
        <h3 className={cx("section-title")}>Danh sách thiết bị hư hỏng</h3>
        <button
          className={cx("edit-button")}
          onClick={handleAddDamagedEquipment}
        >
          <EditIcon className={cx("edit-icon")} />
          <span className={cx("edit-text")}>Chỉnh sửa danh sách</span>
        </button>
      </div>
      <div className={cx("section-content")}>
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
                  <td className={cx("table-cell")}>{item.damageDescription}</td>
                  <td className={cx("table-cell", "price-cell")}>
                    {item.damageFee?.toLocaleString()} VND
                  </td>
                </tr>
              ))
            ) : (
              <tr className={cx("table-row")}>
                <td colSpan={6} className={cx("table-cell", "empty-cell")}>
                  Không có thiết bị hư hỏng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderServicesList = () => (
    <div className={cx("checkout-section")}>
      <div className={cx("section-header")}>
        <h3 className={cx("section-title")}>Danh sách dịch vụ sử dụng</h3>
        <button className={cx("edit-button")} onClick={() => setIsServiceModalOpen(true)}>
          <EditIcon className={cx("edit-icon")} />
          <span className={cx("edit-text")}>Chỉnh sửa danh sách</span>
        </button>
      </div>
      <div className={cx("section-content")}>
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
            {booking?.servicesUsed && booking.servicesUsed.serviceOrders.length === 0 && (
              <tr className={cx("table-row")}>
                <td className={cx("table-cell")} colSpan={7}>Không có dịch vụ nào</td>
              </tr>
            )}
            {booking?.servicesUsed?.serviceOrders?.map((order, orderIndex) => (
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
  );

  const renderTotalSummary = () => (
    <div className={cx("checkout-section")}>
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
              {formatCurrency(calculateGrandTotal())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsumablesModal = () => (
    <ConsumablesModal
      open={isConsumablesModalOpen}
      onClose={() => setIsConsumablesModalOpen(false)}
      rooms={booking?.rooms || []}
      onSave={handleConsumablesUpdate}
      consumablesSelected={booking?.consumablesUsed || []}
    />
  );

  const renderEquipmentDamageModal = () => (
    <EquipmentDamageModal
      open={isEquipmentDamageModalOpen}
      onClose={() => setIsEquipmentDamageModalOpen(false)}
      rooms={booking?.rooms || []}
      onSave={handleEquipmentDamageUpdate}
      equipmentListDamaged={booking?.equipmentDamagedList || []}
    />
  );

  const renderServiceModal = () => (
    <ServiceModal
      open={isServiceModalOpen}
      onClose={() => setIsServiceModalOpen(false)}
      bookingServiceId={booking?.id || 0}
      bookingId={booking?.id || 0}
      customer={booking?.customer}
    />
  );

  const renderConfirmCheckout = () => (
    <Dialog
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgb(0 0 0 / 0.3)'
        }
      }}

      open={isConfirmCheckoutOpen}
      onClose={() => setIsConfirmCheckoutOpen(false)}
    >
      <DialogTitle style={{fontSize: "2rem"}}>Xác nhận Checkout</DialogTitle>
      <DialogContent>
        <p style={{fontSize: "1.6rem"}}>Bạn có chắc chắn muốn Checkout?</p>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setIsConfirmCheckoutOpen(false)}
          style={{fontSize: "1.2rem"}}
        >
          Hủy
        </Button>
        <Button
          onClick={() => {
            handleCheckout();
            setIsConfirmCheckoutOpen(false);
          }}
          color="primary"
          style={{fontSize: "1.2rem"}}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!booking) return <div>No booking found</div>;

  return (
    <Container
      title="Checkout"
      linkToBack="/reception/booking/list"
      titleToBack="Quay lại trang danh sách đặt phòng"
    >
      <div className={cx("checkout-container")}>
        <div className={cx("checkout-info")}>
          {renderCustomerInfo()}
          {renderRoomInfo()}
        </div>
        {renderConsumablesList()}
        {renderDamagesList()}
        {renderServicesList()}
        {renderTotalSummary()}
        <div className={cx("checkout-actions")}>
          <button 
            className={cx("checkout-button")}
            onClick={() => setIsConfirmCheckoutOpen(true)}
          >
            <CreditCard className={cx("checkout-button-icon")} />
            <span className={cx("checkout-button-text")}>Checkout</span>
          </button>
        </div>
        {renderConsumablesModal()}
        {renderEquipmentDamageModal()}
        {renderServiceModal()}
        {renderConfirmCheckout()}
      </div>
    </Container>
  );
};

export default Checkout;
