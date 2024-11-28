import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Select, MenuItem, CircularProgress } from "@mui/material";
import classNames from "classnames/bind";
import styles from "./EditServiceOrderDialog.module.scss";
import { BookingServiceOrder, ServiceItem, ServiceType } from "../../types/hotel";
import { useState, useEffect } from "react";
import { getServiceTypeList, getServiceItemList } from "../../apis/serviceApis";
import { updateServiceOrder, createServiceOrder } from "../../apis/bookingApis/bookingApis";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

interface EditServiceOrderDialogProps {
  open: boolean;
  onClose: () => void;
  serviceOrderSelected: BookingServiceOrder | null;
  onOrderUpdated: () => void;
  bookingId: number;
  isChangeServiceType?: boolean;
}

const EditServiceOrderDialog = ({
  open,
  onClose,
  serviceOrderSelected,
  onOrderUpdated,
  bookingId,
  isChangeServiceType = false
}: EditServiceOrderDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rootServiceOrder, setRootServiceOrder] = useState<BookingServiceOrder | null>(null);
  const [localServiceOrder, setLocalServiceOrder] = useState<BookingServiceOrder | null>(null);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceTypeItems, setServiceTypeItems] = useState<ServiceType[]>([]);

  // Initialize local state when serviceOrderSelected changes
  useEffect(() => {
    setLocalServiceOrder(serviceOrderSelected);
    setRootServiceOrder(serviceOrderSelected);
  }, [serviceOrderSelected]);

  // Load service types on mount
  useEffect(() => {
    const loadServiceTypes = async () => {
      try {
        const types = await getServiceTypeList();
        setServiceTypeItems(types);
      } catch (error) {
        toast.error('Lỗi tải dữ liệu loại dịch vụ');
      }
    };
    loadServiceTypes();
  }, []);

  // Load service items when serviceTypeId changes
  useEffect(() => {
    const loadServiceItems = async () => {
      if (!localServiceOrder?.serviceTypeId) {
        setServiceItems([]);
        return;
      }
      try {
        const items = await getServiceItemList(localServiceOrder.serviceTypeId);
        setServiceItems(items);
      } catch (error) {
        toast.error('Lỗi tải dữ liệu dịch vụ');
      }
    };
    loadServiceItems();
  }, [localServiceOrder?.serviceTypeId]);

  const handleAddServiceItem = (serviceItem: ServiceItem) => {
    if (!localServiceOrder) return;

    // Kiểm tra xem item đã tồn tại trong order chưa
    const existingItem = localServiceOrder.orderItems?.find(
      item => item.serviceItem?.id === serviceItem.id
    );

    if (existingItem) {
      // Nếu item đã tồn tại, tăng số lượng lên 1
      const updatedItems = localServiceOrder.orderItems?.map(item =>
        item.serviceItem?.id === serviceItem.id
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * (serviceItem.price || 0) }
          : item
      );

      setLocalServiceOrder({
        ...localServiceOrder,
        orderItems: updatedItems,
      });
    } else {
      // Nếu item chưa tồn tại, thêm mới với số lượng là 1
      const newOrderItem = {
        serviceItem: serviceItem,
        quantity: 1,
        totalPrice: serviceItem.price || 0,
      };

      setLocalServiceOrder({
        ...localServiceOrder,
        orderItems: [...(localServiceOrder.orderItems || []), newOrderItem],
      });
    }
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setLocalServiceOrder(prev => {
      if (!prev) return prev;
      
      const updatedItems = prev.orderItems?.map(item =>
        item.serviceItem.id === itemId
          ? { 
              ...item, 
              quantity: newQuantity, 
              totalPrice: newQuantity * (item.serviceItem.price || 0) 
            }
          : item
      );

      return {
        ...prev,
        orderItems: updatedItems,
      };
    });
  };

  const handleRemoveItem = (itemToRemove: any) => {
    setLocalServiceOrder(prev => {
      if (!prev) return prev;
      
      const updatedItems = prev.orderItems?.filter(
        item => item.serviceItem.id !== itemToRemove.serviceItem.id
      );

      return {
        ...prev,
        orderItems: updatedItems,
      };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (!localServiceOrder) return;
    if (localServiceOrder.orderItems?.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 dịch vụ');
      
      return;
    }
    
    try {
      if (localServiceOrder.id) {
        await updateServiceOrder(localServiceOrder.id, localServiceOrder);
      } else {
        await createServiceOrder(bookingId, localServiceOrder);
      }
      onOrderUpdated();
      onClose();
      toast.success(localServiceOrder.id ? 'Cập nhật đơn hàng thành công' : 'Tạo đơn hàng thành công');
    } catch (error) {
      toast.error(localServiceOrder.id ? 'Lỗi cập nhật đơn hàng' : 'Lỗi tạo đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
      <DialogTitle className={cx('dialog-title')}>
        Chỉnh sửa đơn hàng
      </DialogTitle>

      <DialogContent className={cx('dialog-content')}>
        <div className={cx('selected-services')}>
          <h3 className={cx('section-title')}>Các dịch vụ đã chọn</h3>
          <table className={cx('services-table')}>
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {localServiceOrder?.orderItems && localServiceOrder.orderItems.length > 0 ? (
                localServiceOrder.orderItems.map((item) => (
                  <tr key={item.serviceItem.id}>
                    <td>{item.serviceItem.name}</td>
                    <td>
                      <button 
                        className={cx('quantity-btn')}
                        onClick={() => handleUpdateQuantity(item.serviceItem.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className={cx('quantity-btn')}
                        onClick={() => handleUpdateQuantity(item.serviceItem.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </td>
                    <td>{item.serviceItem.price?.toLocaleString()}đ</td>
                    <td>{(item.quantity * (item.serviceItem.price || 0)).toLocaleString()}đ</td>
                    <td>
                      <button 
                        className={cx('remove-btn')}
                        onClick={() => handleRemoveItem(item)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={cx('empty-cell')}>
                    Hãy chọn dịch vụ để đặt hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={cx('available-services')}>
          <h3 className={cx('section-title')}>Danh sách dịch vụ</h3>
          <FormControl fullWidth className={cx('type-select')}>
            <Select
              value={localServiceOrder?.serviceTypeId || ''}
              onChange={(e) => {
                if (isChangeServiceType) {
                  setLocalServiceOrder(prev => prev ? { ...prev, orderItems: [] } : prev);
                  setLocalServiceOrder(prev => prev ? { ...prev, serviceTypeId: e.target.value as number } : prev);
                }
              }}
              label="Loại dịch vụ"
              sx={{ fontSize: '1.4rem', height: '40px' }}
              disabled={!isChangeServiceType}
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

          <div className={cx('items-grid')}>
            {serviceItems.length > 0 ? serviceItems.map((item) => (
              <div key={item.id} className={cx('item-card')} onClick={() => handleAddServiceItem(item)}>
                <img 
                  src={item.image || '/default-service.png'} 
                  alt={item.name || '_'}
                />
                <div className={cx('item-info')}>
                  <h4>{item.name}</h4>
                  <p>{item.price?.toLocaleString() || 0}đ</p>
                </div>
              </div>
            )) : (
              <div className={cx('no-items')}>
                {localServiceOrder?.serviceTypeId ? 'Không có dịch vụ nào trong loại này' : 'Vui lòng chọn loại dịch vụ'}
              </div>
            )}
          </div>
        </div>

        <div className={cx('order-note')}>
          <h4 className={cx('note-title')}>Ghi chú:</h4>
          <textarea
            value={localServiceOrder?.note || ''}
            onChange={(e) => {
              setLocalServiceOrder((prev) => {
                if (!prev) return prev;
                return { ...prev, note: e.target.value };
              });
            }}
            placeholder="Nhập ghi chú cho đơn hàng..."
            rows={4}
            className={cx('note-input')}
          />
        </div>
      </DialogContent>

      <DialogActions className={cx('dialog-actions')}>
        <Button 
          onClick={onClose}
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
          onClick={handleSave}
          sx={{ 
            fontSize: "1.4rem",
            textTransform: "none",
            minWidth: "100px"
          }}
          disabled={JSON.stringify(localServiceOrder) === JSON.stringify(rootServiceOrder) || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditServiceOrderDialog; 