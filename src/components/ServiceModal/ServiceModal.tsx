import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import classNames from "classnames/bind";
import styles from "./ServiceModal.module.scss";
import { BookingService, ServiceItem, ServiceType, BookingServiceOrder, OrderItem } from "../../types/hotel";
import { getServiceTypeList, getServiceItemList } from "../../apis/serviceApis";
import { updateServiceOrder, createServiceOrder, deleteServiceOrder, confirmServicedForOrder, getServicesByBookingId } from "../../apis/bookingApis/bookingApis";
import { toast } from "react-toastify";
import moment from "moment";

const cx = classNames.bind(styles);

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: number;
}

const ServiceModal = ({ open, onClose, bookingId }: ServiceModalProps) => {
  const [serviceOrderSelected, setServiceOrderSelected] = useState<BookingServiceOrder | null>(null);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceTypeItems, setServiceTypeItems] = useState<ServiceType[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<number | ''>('');
  const [servicesUsed, setServicesUsed] = useState<BookingService>({ bookingId: 0, serviceOrders: [] });

  useEffect(() => {
    loadServicesUsed();
  }, [bookingId]);

  const loadServicesUsed = async () => {
    const services = await getServicesByBookingId(bookingId);
    setServicesUsed(services);
  }
  useEffect(() => {
    const loadServiceData = async () => {
      try {
        const types = await getServiceTypeList();
        setServiceTypeItems(types);
      } catch (error) {
        toast.error('Lỗi tải dữ liệu loại dịch vụ');
      }
    };
    loadServiceData();
  }, []);

  useEffect(() => {
    const loadServiceItems = async () => {
      if (!selectedType) {
        setServiceItems([]);
        return;
      }
      try {
        const items = await getServiceItemList(selectedType);
        setServiceItems(items);
      } catch (error) {
        toast.error('Lỗi tải dữ liệu dịch vụ');
      }
    };
    loadServiceItems();
  }, [selectedType]);

  const handleConfirmService = async (order: BookingServiceOrder) => {
    try {
      if (order) {
        await confirmServicedForOrder(order.id!);
        loadServicesUsed();
        toast.success('Xác nhận phục vụ đơn hàng thành công');
      }
    } catch (error) {
      toast.error('Lỗi xác nhận phục vụ đơn hàng');
    }
  }

  const handleEditOrder = async (orderId: number, updatedOrder: BookingServiceOrder) => {
    try {
      await updateServiceOrder(orderId, updatedOrder);
      loadServicesUsed();
      setEditDialogOpen(false);
      toast.success('Cập nhật đơn hàng thành công');
    } catch (error) {
      toast.error('Lỗi cập nhật đơn hàng');
    }
  };

  const handleAddServiceItem = (serviceItem: ServiceItem) => {
    if (!serviceOrderSelected) return;

    const existingItem = serviceOrderSelected.orderItems?.find(
      item => item.serviceItem?.id === serviceItem.id
    );

    if (existingItem) {
      const updatedItems = serviceOrderSelected.orderItems?.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * (item.serviceItem?.price || 0) }
          : item
      );

      setServiceOrderSelected({
        ...serviceOrderSelected,
        orderItems: updatedItems,
      });
    } else {
      const newOrderItem: OrderItem = {
        serviceItem: serviceItem,
        quantity: 1,
        totalPrice: serviceItem.price || 0,
      };

      setServiceOrderSelected({
        ...serviceOrderSelected,
        orderItems: [...(serviceOrderSelected.orderItems || []), newOrderItem],
      });
    }
  };

  return (
    <>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '1000px',
            width: '90%',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }
        }}
        open={open}
        onClose={onClose}
        maxWidth={false}
      >
        <DialogTitle className={cx('dialog-title')} sx={{
          fontSize: "2.4rem",
          fontWeight: 700,
          textAlign: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #e0e0e0"
        }}>
          Quản lý dịch vụ
        </DialogTitle>

        <DialogContent className={cx('dialog-content')} sx={{ padding: "24px" }}>
          <div className={cx('content-wrapper')}>
            <div className={cx('service-order-list')}>
              <h3 className={cx('section-title')}>Danh sách dịch vụ</h3>
              <table className={cx('order-table')}>
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày tạo</th>
                    <th>Phục vụ lúc</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesUsed.serviceOrders ? servicesUsed.serviceOrders.map((order) => (
                    <tr key={order.id} onClick={() => setServiceOrderSelected(order)}>
                      <td>{order.id}</td>
                      <td>{moment(order.orderCreatedAt).format('DD/MM/YYYY HH:mm')}</td>
                      <td>{moment(order.servicedAt).format('DD/MM/YYYY HH:mm')}</td>
                      <td>{order.status}</td>
                      <td>
                        <button 
                          disabled={order.status?.toLowerCase() !== "mới"}
                          onClick={() => {
                            setServiceOrderSelected(order);
                            setEditDialogOpen(true);
                          }}
                        >
                          Chỉnh sửa
                        </button>
                        <button onClick={() => handleConfirmService(order)}>Xác nhận phục vụ</button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={5} style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>

        <DialogActions className={cx('dialog-actions')} sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0" }}>
          
        </DialogActions>
      </Dialog>

      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '1000px',
            width: '90%',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <DialogTitle className={cx('dialog-title')} sx={{
          fontSize: "2.4rem",
          fontWeight: 700,
          textAlign: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #e0e0e0"
        }}>
          Chỉnh sửa đơn hàng
        </DialogTitle>
        <DialogContent className={cx('dialog-content')} sx={{ padding: "24px" }}>
          <div className={cx('selected-services')}>
            <h3 className={cx('section-title')}>Dịch vụ đã chọn</h3>
            <table className={cx('services-table')}>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên dịch vụ</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {serviceOrderSelected?.orderItems?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={item.serviceItem?.image || '/default-service.png'} 
                        alt={item.serviceItem?.name}
                        className={cx('item-image')}
                      />
                    </td>
                    <td>{item.serviceItem?.name}</td>
                    <td>
                      <input
                        type="number"
                        className={cx('quantity-input')}
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (newQuantity < 1) return;
                          
                          const updatedItems = serviceOrderSelected.orderItems?.map(orderItem =>
                            orderItem.serviceItem?.id === item.serviceItem?.id 
                              ? { ...orderItem, quantity: newQuantity, totalPrice: newQuantity * (item.serviceItem?.price || 0) }
                              : orderItem
                          );
                          
                          setServiceOrderSelected({
                            ...serviceOrderSelected,
                            orderItems: updatedItems,
                          });
                        }}
                      />
                    </td>
                    <td>{item.serviceItem?.price?.toLocaleString()}đ</td>
                    <td>{(item.quantity * (item.serviceItem?.price || 0)).toLocaleString()}đ</td>
                    <td>
                      <Button
                        style={{fontSize: "12px"}}
                        color="error"
                        onClick={() => {
                          const updatedItems = serviceOrderSelected.orderItems?.filter(
                            orderItem => orderItem.id !== item.id
                          );
                          setServiceOrderSelected({
                            ...serviceOrderSelected,
                            orderItems: updatedItems,
                          });
                        }}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng tiền:</td>
                  <td colSpan={2} style={{ fontWeight: 'bold' }}>
                    {serviceOrderSelected?.orderItems?.reduce((sum, item) => 
                      sum + (item.quantity * (item.serviceItem?.price || 0)), 0
                    ).toLocaleString()}đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className={cx('available-services')}>
            <h3 className={cx('section-title')}>Danh sách dịch vụ</h3>
            <FormControl fullWidth className={cx('type-select')} style={{marginBottom: '20px'}}>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as number)}
                label="Loại dịch vụ"
                sx={{ fontSize: '1.4rem', height: '40px' }}
              >
                <MenuItem value="" style={{ fontStyle: 'italic', fontSize: '1.4rem' }}>
                  <em>Chọn loại dịch vụ</em>
                </MenuItem>
                {serviceTypeItems.map((type) => (
                  <MenuItem key={type.id} value={type.id} style={{ fontSize: '1.4rem' }}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <table className={cx('services-table')}>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên dịch vụ</th>
                  <th>Giá</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {serviceItems.length > 0 ? serviceItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={item.image || '/default-service.png'} 
                        alt={item.name}
                        className={cx('item-image')}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price?.toLocaleString()}đ</td>
                    <td>
                      <Button
                        style={{fontSize: "11px"}}
                        variant="contained"
                        onClick={() => handleAddServiceItem(item)}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className={cx('empty-cell')}>
                      {selectedType ? 'Không có dịch vụ nào trong loại này' : 'Vui lòng chọn loại dịch vụ'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={cx('order-note')}>
            <h4 className={cx('note-title')}>Ghi chú:</h4>
            <textarea
              value={serviceOrderSelected?.note || ''}
              onChange={(e) => {
                setServiceOrderSelected(prev => 
                  prev ? { ...prev, note: e.target.value } : null
                );
              }}
              placeholder="Nhập ghi chú cho đơn hàng..."
              rows={4}
              className={cx('note-input')}
            />
          </div>
        </DialogContent>
        <DialogActions className={cx('dialog-actions')} sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0" }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ 
              fontSize: "1.4rem",
              textTransform: "none",
              minWidth: "100px"
            }}
          >
            Hủy
          </Button>
          <Button 
            variant="contained"
            onClick={() => serviceOrderSelected && handleEditOrder(serviceOrderSelected.id!, serviceOrderSelected)}
            sx={{ 
              fontSize: "1.4rem",
              textTransform: "none",
              minWidth: "100px"
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceModal; 