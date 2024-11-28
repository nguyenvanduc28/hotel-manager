import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import classNames from "classnames/bind";
import styles from "./ServiceModal.module.scss";
import { BookingService, BookingServiceOrder, Customer } from "../../types/hotel";
import { getServicesByBookingId, changeStatusToOrderService } from "../../apis/bookingApis/bookingApis";
import { toast } from "react-toastify";
import moment from "moment";
import { BOOKING_SERVICE_ORDER_STATUS } from "../../constants/admin/constants";
import EditServiceOrderDialog from './EditServiceOrderDialog';

const cx = classNames.bind(styles);

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: number;
  bookingServiceId?: number;
  customer?: Customer;
}

const ServiceModal = ({ open, onClose, bookingId, bookingServiceId, customer }: ServiceModalProps) => {
  const [serviceOrderSelected, setServiceOrderSelected] = useState<BookingServiceOrder | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [servicesUsed, setServicesUsed] = useState<BookingService>({ bookingId: 0, serviceOrders: [] });

  useEffect(() => {
    loadServicesUsed();
  }, [bookingId]);

  const loadServicesUsed = async () => {
    const services = await getServicesByBookingId(bookingId);
    setServicesUsed(services);
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await changeStatusToOrderService(orderId, newStatus);
      loadServicesUsed();
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái đơn hàng');
    }
  };

  const handleCreateNewOrder = () => {
    if (!bookingServiceId) return;
    const noteText = `bookingId: ${bookingId}\nKhách hàng: ${customer?.name}\nSĐT: ${customer?.phoneNumber || '_'}`;

    setServiceOrderSelected({
      bookingServiceId: bookingServiceId,
      orderItems: [],
      status: BOOKING_SERVICE_ORDER_STATUS.NEW,
      note: noteText
    });
    setEditDialogOpen(true);
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
                  {servicesUsed.serviceOrders && servicesUsed.serviceOrders.length > 0 ? servicesUsed.serviceOrders.map((order) => (
                    <tr key={order.id} onClick={() => setServiceOrderSelected(order)}>
                      <td>{order.id}</td>
                      <td>{order.orderCreatedAt ? moment(order.orderCreatedAt).format('DD/MM/YYYY HH:mm') : '_'}</td>
                      <td>{order.servicedAt ? moment(order.servicedAt).format('DD/MM/YYYY HH:mm') : '_'}</td>
                      <td>{order.status}</td>
                      <td>
                        <button 
                          disabled={order.status !== BOOKING_SERVICE_ORDER_STATUS.NEW}
                          onClick={() => {
                            setServiceOrderSelected(order);
                            setEditDialogOpen(true);
                          }}
                        >
                          Chỉnh sửa
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id!, e.target.value)}
                          className={cx('status-select')}
                          style={{ 
                            marginLeft: '8px',
                            padding: '4px 8px',
                            fontSize: '1.4rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                          }}
                        >
                          <option value={BOOKING_SERVICE_ORDER_STATUS.NEW}>{BOOKING_SERVICE_ORDER_STATUS.NEW}</option>
                          <option value={BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS}>{BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS}</option>
                          <option value={BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE}>{BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE}</option>
                          <option value={BOOKING_SERVICE_ORDER_STATUS.SERVICED}>{BOOKING_SERVICE_ORDER_STATUS.SERVICED}</option>
                        </select>
                      </td>
                    </tr>
                  )) : <tr><td colSpan={5} style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>

        <DialogActions className={cx('dialog-actions')} sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0" }}>
          <Button
            variant="contained"
            onClick={handleCreateNewOrder}
            sx={{ 
              fontSize: "1.4rem",
              textTransform: "none",
              minWidth: "100px"
            }}
          >
            Thêm mới
          </Button>
        </DialogActions>
      </Dialog>

      <EditServiceOrderDialog 
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        serviceOrderSelected={serviceOrderSelected}
        onOrderUpdated={loadServicesUsed}
        bookingId={bookingId}
        isChangeServiceType={true}
      />
    </>
  );
};

export default ServiceModal; 