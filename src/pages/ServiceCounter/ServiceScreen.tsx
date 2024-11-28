import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { BookingServiceOrder } from "../../types/hotel";
import styles from "./ServiceScreen.module.scss";
import classNames from "classnames/bind";
import { getBookingServiceOrderList } from "../../apis/serviceApis";
import { BOOKING_SERVICE_ORDER_STATUS, SERVICE_TYPE } from "../../constants/admin/constants";
import { useHotel } from "../../hooks/useHotel";
import moment from "moment";
import { changeStatusToOrderService } from "../../apis/bookingApis/bookingApis";
import EditServiceOrderDialog from '../../components/ServiceModal/EditServiceOrderDialog';
const cx = classNames.bind(styles);

const ServiceScreen = ({status, reloadCount, numOfStatus}: {status: string, reloadCount: () => void, numOfStatus: { [key: string]: number }}) => {
  const { user } = useAuth();
  const {hotelInfo} = useHotel();
  const serviceTypeId = user?.roles.find(role => role.name === "BAR_COUNTER") 
    ? SERVICE_TYPE.BAR 
    : user?.roles.find(role => role.name === "RESTAURANT_COUNTER")
    ? SERVICE_TYPE.RESTAURANT
    : undefined;

  const [orderList, setOrderList] = useState<BookingServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<BookingServiceOrder | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchOrderList = async () => {
    const response = await getBookingServiceOrderList(status, hotelInfo?.id || 0, serviceTypeId || 0);
    setOrderList(response);
    if (response.length > 0) {
      setSelectedOrder(response[0]);
    }
    setIsLoading(false);
  }

  const handleUpdateStatus = async () => {
    const nextStatus = status === BOOKING_SERVICE_ORDER_STATUS.NEW 
      ? BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS
      : status === BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS
      ? BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE
      : BOOKING_SERVICE_ORDER_STATUS.SERVICED;
    await changeStatusToOrderService(selectedOrder?.id || 0, nextStatus);
    fetchOrderList();
    reloadCount();
  }

  useEffect(() => {
    fetchOrderList();
  }, [status, hotelInfo?.id, serviceTypeId, numOfStatus[status]]);

  return <div className={cx("service-screen")}>
    <div className={cx("order-list")}>
      {isLoading ? (
        <div>Loading...</div>
      ) : orderList.length > 0 ? (
        orderList.map((order) => (
          <div 
            key={order.id} 
            className={cx("order-item", { active: selectedOrder?.id === order.id })}
            onClick={() => setSelectedOrder(order)}
          >
            <div className={cx("order-header")}>
              <div className={cx("order-info")}>
                <div className={cx("order-id")}>Đơn hàng #{order.id}</div>
                <div className={cx("order-date")}>{moment(order.orderCreatedAt).format("HH:mm DD/MM/YYYY")}</div>
                <div className={cx("order-note")}>Ghi chú: {order.note}</div>
              </div>

              <div className={cx("order-actions")}>
                <button 
                  className={cx("order-detail-button")} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                    setEditDialogOpen(true);
                  }} 
                  disabled={order.status === BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE || order.status === BOOKING_SERVICE_ORDER_STATUS.SERVICED}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
            <div className={cx("order-service-items")}>
              <table>
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td><img src={item.serviceItem.image} alt={item.serviceItem.name} /></td>
                      <td>{item.serviceItem.name}</td>
                      <td>x{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className={cx("no-order")}>Không có đơn hàng</div>
      )}
    </div>

    {orderList.length > 0 ? (
      <div className={cx("order-total")}>
        {selectedOrder ? (
          <div>
          <div className={cx("detail-header")}>
            <h3>Chi tiết đơn hàng</h3>
            <button 
              className={cx("update-status-button")}
              onClick={() => {handleUpdateStatus()}}
              disabled={selectedOrder.status === BOOKING_SERVICE_ORDER_STATUS.SERVICED}
            >
              {selectedOrder.status === BOOKING_SERVICE_ORDER_STATUS.NEW && "Bắt đầu làm"}
              {selectedOrder.status === BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS && "Sẵn sàng phục vụ"}
              {selectedOrder.status === BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE && "Phục vụ"}
              {selectedOrder.status === BOOKING_SERVICE_ORDER_STATUS.SERVICED && "Hoàn tất"}
            </button>
          </div>

          <div className={cx("detail-row")}>
            <span>Đơn hàng:</span>
            <span>#{selectedOrder.id}</span>
          </div>

          <div className={cx("detail-row")}>
            <span>Ngày tạo:</span>
            <span>{moment(selectedOrder.orderCreatedAt).format("HH:mm DD/MM/YYYY")}</span>
          </div>

          <div className={cx("detail-row")}>
            <span>Trạng thái:</span>
            <span>{selectedOrder.status}</span>
          </div>

          <div className={cx("detail-row")}>
            <span>Ghi chú:</span>
            <span>{selectedOrder.note || "Không có ghi chú"}</span>
          </div>
          <div className={cx("detail-row", "total-price")}>
            <span>Tổng tiền:</span>
            <span>{selectedOrder.totalPrice?.toLocaleString()} VNĐ</span>
          </div>
        </div>
      ) : (
        <div className={cx("no-selection")}>
          Select an order to view details
        </div>
        )}
      </div>
    ) : null}

    <EditServiceOrderDialog 
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      serviceOrderSelected={selectedOrder}
      onOrderUpdated={fetchOrderList}
      bookingId={selectedOrder?.bookingServiceId || 0}
      isChangeServiceType={false}
    />
  </div>;
};

export default ServiceScreen;
