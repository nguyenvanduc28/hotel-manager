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
import { BookingServiceItem, ServiceItem, ServiceType } from "../../types/hotel";
import { getServiceTypeList, getServiceItemList } from "../../apis/serviceApis";
import { updateBookingServiceItemList } from "../../apis/bookingApis/bookingApis";

const cx = classNames.bind(styles);

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: number;
  servicesUsed: BookingServiceItem[];
  onSave: (updatedServices: BookingServiceItem[]) => void;
}

const ServiceModal = ({ open, onClose, bookingId, servicesUsed, onSave }: ServiceModalProps) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedType, setSelectedType] = useState<number | ''>('');
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [selectedServices, setSelectedServices] = useState<BookingServiceItem[]>(servicesUsed);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceTypes = async () => {
    try {
      const types = await getServiceTypeList();
      setServiceTypes(types);
    } catch (error) {
      setError('Failed to fetch service types');
      console.error(error);
    }
  };
  const fetchServiceItems = async () => {
    if (!selectedType) {
      setServiceItems([]);
      return;
    }

    try {
      const items = await getServiceItemList(selectedType);
      setServiceItems(items);
    } catch (error) {
      setError('Failed to fetch service items');
      console.error(error);
    }
  };

  // Fetch service types on mount
  useEffect(() => {
    fetchServiceTypes();
  }, []);
  
  // Fetch service items when type is selected
  useEffect(() => {
    fetchServiceItems();
  }, [selectedType]);

  const handleAddService = (serviceItem: ServiceItem) => {
    const newService: BookingServiceItem = {
      bookingId,
      serviceItem,
      quantity: 1, // Default quantity
      totalPrice: serviceItem.price, // Initial price
    };

    setSelectedServices([...selectedServices, newService]);
  };

  const handleUpdateQuantity = (serviceItemId: number | undefined, quantity: number) => {
    setSelectedServices(services =>
      services.map(service =>
        service.serviceItem.id === serviceItemId
          ? { 
              ...service, 
              quantity: quantity,
              totalPrice: service.serviceItem.price * quantity 
            }
          : service
      )
    );
  };

  const handleUpdateNote = (serviceItemId: number | undefined, note: string) => {
    setSelectedServices(services =>
      services.map(service =>
        service.serviceItem.id === serviceItemId
          ? { ...service, note }
          : service
      )
    );
  };

  const handleRemoveService = (serviceItemId: number | undefined) => {
    setSelectedServices(services =>
      services.filter(service => service.serviceItem.id !== serviceItemId)
    );
  };

  const handleSave = async () => {
    try {
      await updateBookingServiceItemList(bookingId, selectedServices);
      onSave(selectedServices);
      onClose();
    } catch (error) {
      setError('Failed to update services');
      console.error(error);
    }
  };

  return (
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
      <DialogTitle 
        sx={{
          fontSize: "2.4rem",
          fontWeight: 700,
          textAlign: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #e0e0e0"
        }}
      >
        Quản lý dịch vụ
      </DialogTitle>

      <DialogContent sx={{ padding: "24px" }}>
        {error && <div className={cx('error-message')}>{error}</div>}

        <div className={cx('selected-services')}>
          <h3>Dịch vụ đã chọn</h3>
          <table className={cx('services-table')}>
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Ghi chú</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedServices.length > 0 ? selectedServices.map((service) => (
                <tr key={service.serviceItem.id}>
                  <td>
                    <img 
                      src={service.serviceItem?.image || '/default-service.png'} 
                      alt={service.serviceItem?.name}
                      className={cx('item-image')}
                    />
                  </td>
                  <td>{service.serviceItem?.name}</td>
                  <td>
                    <input
                      type="number"
                      className={cx('quantity-input')}
                      value={service.quantity || 1}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value);
                        if (!isNaN(quantity) && quantity > 0) {
                          handleUpdateQuantity(service.serviceItem?.id, quantity);
                        }
                      }}
                    />
                  </td>
                  <td>{service.totalPrice?.toLocaleString()} VND</td>
                  <td>
                    <input
                      type="text"
                      className={cx('note-input')}
                      value={service.note || ''}
                      onChange={(e) => handleUpdateNote(service.serviceItem?.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <Button
                      style={{fontSize: "12px"}}
                      color="error"
                      onClick={() => handleRemoveService(service.serviceItem.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className={cx('empty-cell')}>Không có dịch vụ nào được chọn</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={cx('available-services')}>
          <h3>Danh sách dịch vụ</h3>
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
              {serviceTypes.map((type) => (
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
              {serviceItems.length > 0 ? serviceItems.map((item) => {
                const isSelected = selectedServices.some(s => s.serviceItem.id === item.id);
                return (
                  <tr key={item.id}>
                    <td>
                      <img 
                        src={item.image || '/default-service.png'} 
                        alt={item.name}
                        className={cx('item-image')}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price.toLocaleString()} VND</td>
                    <td>
                      <Button
                        style={{fontSize: "11px"}}
                        variant="contained"
                        disabled={isSelected}
                        onClick={() => handleAddService(item)}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className={cx('empty-cell')}>
                    {selectedType ? 'Không có dịch vụ nào trong loại này' : 'Vui lòng chọn loại dịch vụ'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0" }}>
        <Button 
          onClick={onClose}
          sx={{ 
            fontSize: "1.4rem",
            textTransform: "none",
            minWidth: "100px"
          }}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
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
  );
};

export default ServiceModal; 