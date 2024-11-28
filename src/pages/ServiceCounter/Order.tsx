import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useHotel } from "../../hooks/useHotel";
import { getServiceItemList } from "../../apis/serviceApis";
import { ServiceItem, OrderItem, Customer } from "../../types/hotel";
import { SERVICE_TYPE } from "../../constants/admin/constants";
import styles from "./Order.module.scss";
import classNames from "classnames/bind";
import { getBookingById, createServiceOrder } from "../../apis/bookingApis/bookingApis";
import { toast } from "react-toastify";
import { BOOKING_SERVICE_ORDER_STATUS } from "../../constants/admin/constants";
import { CircularProgress } from "@mui/material";

const cx = classNames.bind(styles);

interface OrderState {
  orderItems: OrderItem[];
  customer: Customer | null;
  note: string;
  totalPrice: number;
  bookingId: number;
}

const Order = ({reloadCount}: {reloadCount: () => void}) => {
  const { user } = useAuth();
  const { hotelInfo } = useHotel();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [orderState, setOrderState] = useState<OrderState>({
    orderItems: [],
    customer: null,
    note: "",
    totalPrice: 0,
    bookingId: 0
  });
  const [bookingCode, setBookingCode] = useState("");

  const serviceTypeId = user?.roles.find(role => role.name === "BAR_COUNTER") 
    ? SERVICE_TYPE.BAR 
    : user?.roles.find(role => role.name === "RESTAURANT_COUNTER")
    ? SERVICE_TYPE.RESTAURANT
    : undefined;

  useEffect(() => {
    const fetchServiceItems = async () => {
      if (serviceTypeId) {
        const items = await getServiceItemList(serviceTypeId);
        setServiceItems(items);
      }
    };
    fetchServiceItems();
  }, [serviceTypeId]);

  const handleAddItem = (serviceItem: ServiceItem) => {
    setOrderState(prev => {
      const existingItem = prev.orderItems.find(
        item => item.serviceItem.id === serviceItem.id
      );

      let newOrderItems: OrderItem[];
      if (existingItem) {
        newOrderItems = prev.orderItems.map(item =>
          item.serviceItem.id === serviceItem.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.serviceItem.price }
            : item
        );
      } else {
        newOrderItems = [...prev.orderItems, {
          serviceItem,
          quantity: 1,
          totalPrice: serviceItem.price
        }];
      }

      const newTotalPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...prev,
        orderItems: newOrderItems,
        totalPrice: newTotalPrice
      };
    });
  };

  const handleRemoveItem = (itemToRemove: OrderItem) => {
    setOrderState(prev => {
      const newOrderItems = prev.orderItems.filter(
        item => item.serviceItem.id !== itemToRemove.serviceItem.id
      );
      const newTotalPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...prev,
        orderItems: newOrderItems,
        totalPrice: newTotalPrice
      };
    });
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setOrderState(prev => {
      const newOrderItems = prev.orderItems.map(item =>
        item.serviceItem.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.serviceItem.price }
          : item
      );
      const newTotalPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        ...prev,
        orderItems: newOrderItems,
        totalPrice: newTotalPrice
      };
    });
  };

  const handleSearchBooking = async (code: string) => {
    setIsSearching(true);
    try {
      const bookingId = parseInt(code);
      if (isNaN(bookingId)) {
        toast.error('Mã booking không hợp lệ');
        return;
      }

      const bookingData = await getBookingById(bookingId);
      // Create note with room numbers, customer name and phone
      const noteText = `bookingId: ${bookingData.id}\nKhách hàng: ${bookingData.customer.name}\nSĐT: ${bookingData.customer.phoneNumber || '_'}`;
      // Update order state with customer info and note from booking
      setOrderState(prev => ({
        ...prev,
        customer: bookingData.customer,
        bookingId: bookingData.id,
        note: noteText
      }));
      setError("");
      setIsSearching(false);
    } catch (error) {
      setError("*Không tìm thấy thông tin booking");
      setOrderState(prev => ({
        ...prev,
        customer: null,
        bookingId: 0,
        note: ""
      }));
      setIsSearching(false);
    }
  };

  const handleCreateOrder = async () => {
    setIsLoading(true);
    if (!orderState.customer || orderState.orderItems.length === 0) {
      toast.error('Vui lòng nhập mã booking và chọn món ăn để đặt hàng');
      return;
    }

    try {
      const newOrder = {
        bookingServiceId: orderState.bookingId,
        orderItems: orderState.orderItems,
        status: BOOKING_SERVICE_ORDER_STATUS.NEW,
        note: orderState.note,
        serviceTypeId: serviceTypeId
      };

      await createServiceOrder(orderState.bookingId, newOrder);
      
      // Reset order state after successful creation
      setOrderState({
        orderItems: [],
        customer: null,
        note: "",
        totalPrice: 0,
        bookingId: 0
      });
      setBookingCode("");
      
      reloadCount();
      
      toast.success('Tạo đơn hàng thành công');
    } catch (error) {
      toast.error('Lỗi tạo đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx("order")}>
      <div className={cx("left-section")}>
        <div className={cx("selected-items")}>
          <h3>Các món đã chọn</h3>
          <table>
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orderState.orderItems.length > 0 ? orderState.orderItems.map(item => (
                <tr key={item.serviceItem.id}>
                  <td>{item.serviceItem.name}</td>
                  <td>
                    <button 
                      className={cx("quantity-btn")}
                      onClick={() => handleUpdateQuantity(item.serviceItem.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className={cx("quantity-btn")}
                      onClick={() => handleUpdateQuantity(item.serviceItem.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>{item.serviceItem.price.toLocaleString()} VNĐ</td>
                  <td>{item.totalPrice.toLocaleString()} VNĐ</td>
                  <td>
                    <button 
                      className={cx("remove-btn")}
                      onClick={() => handleRemoveItem(item)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className={cx("empty-cell")}>
                    Hãy chọn món ăn để đặt hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={cx("service-items")}>
          <h3>Danh sách món</h3>
          <div className={cx("items-grid")}>
            {serviceItems.length > 0 ? serviceItems.map(item => (
              <div key={item.id} className={cx("item-card")} onClick={() => handleAddItem(item)}>
                <img 
                  src={item.image || '/default-service.png'} 
                  alt={item.name || '_'}
                />
                <div className={cx("item-info")}>
                  <h4>{item.name}</h4>
                  <p>{item.price.toLocaleString()} VNĐ</p>
                </div>
              </div>
            )) : (
              <div className={cx("no-items")}>
                Không có món ăn nào
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cx("right-section")}>
        <div className={cx("customer-search")}>
          <input 
            type="text" 
            placeholder="Nhập mã booking..."
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchBooking(bookingCode);
              }
            }}
          />
          <button onClick={() => handleSearchBooking(bookingCode)}>
            {isSearching ? <CircularProgress size={24} /> : "Tìm kiếm"}
          </button>
        </div>
        {error && <p className={cx("error-message")}>{error}</p>}

        {orderState.customer && (
          <div className={cx("customer-info")}>
            <h3>Thông tin khách hàng</h3>
            <p>Tên: {orderState.customer.name}</p>
            <p>SĐT: {orderState.customer.phoneNumber}</p>
          </div>
        )}

        <div className={cx("order-note")}>
          <textarea
            placeholder="Ghi chú đơn hàng..."
            value={orderState.note}
            onChange={(e) => setOrderState(prev => ({ ...prev, note: e.target.value }))}
          />
        </div>

        <div className={cx("order-summary")}>
          <div className={cx("total-amount")}>
            <span>Tổng tiền:</span>
            <span>{orderState.totalPrice.toLocaleString()} VNĐ</span>
          </div>
          <button 
            className={cx("order-button")}
            onClick={handleCreateOrder}
            disabled={!orderState.customer || orderState.orderItems.length === 0 || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
