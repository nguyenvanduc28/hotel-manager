import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../../components/Container/Container";
import styles from "./CustomerDetail.module.scss";
import classNames from "classnames/bind";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Booking, Customer, Invoice } from "../../../types/hotel";
import { getInvoicesByCustomerId } from "../../../apis/invoiceApis/invoiceApis";
import { searchCustomersByName } from "../../../apis/customerApis/customerApis";
import moment from "moment";
import { ADMIN_PATHS, RECEPTION_PATHS } from "../../../constants/admin/adminPath";
import { Divider } from "@mui/material";
import InvoiceModal from "../../../components/InvoiceModal/InvoiceModal";
import { getBookingById } from "../../../apis/bookingApis/bookingApis";
import Loading from "../../../components/Loading/Loading";

const cx = classNames.bind(styles);

const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Tạm thời dùng searchCustomersByName để lấy thông tin khách hàng
        const customers = await searchCustomersByName("");
        const currentCustomer = customers.find(
          (c: Customer) => c.id === Number(id)
        );
        setCustomer(currentCustomer);

        // Lấy danh sách hóa đơn của khách hàng
        const customerInvoices = await getInvoicesByCustomerId(Number(id));
        setInvoices(customerInvoices);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const handleViewInvoice = async (invoice: Invoice) => {
    try {
      if (!invoice.booking || !invoice.booking.id) {
        console.error("Không tìm thấy thông tin đặt phòng");
        return;
      }
      
      const booking = await getBookingById(invoice.booking.id);
      setSelectedBooking(booking);
      setSelectedInvoice(invoice);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Không thể lấy thông tin đặt phòng:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      headerAlign: "left",
      renderHeader: () => <span style={{ paddingLeft: "10px" }}>ID</span>,
      renderCell: (params) => (
        <span style={{ paddingLeft: "10px" }}>{params.row.id}</span>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      renderCell: (params) => (
        <span>{params.row.totalAmount?.toLocaleString('vi-VN')} VNĐ</span>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Phương thức thanh toán",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      renderCell: (params) => <span>{params.row.paymentMethod || "Tiền mặt"}</span>,
    },
    {
      field: "issueDate",
      headerName: "Ngày tạo",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      renderCell: (params) => (
        <span>
          {params.row.issueDate
            ? moment.unix(params.row.issueDate).format("HH:mm DD/MM/YYYY")
            : "_"}
        </span>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Trạng thái",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      renderCell: (params) => <span>{params.row.paymentStatus || "_"}</span>,
    },
  ];

  // Tính tổng số tiền đã thanh toán (dummy data)
  const totalPaid = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

  return (
    <Container 
      title="Chi tiết khách hàng" 
      linkToBack={window.location.pathname.startsWith('/admin') ? 
        '/admin/' + ADMIN_PATHS.CUSTOMERS : 
        '/reception/' + RECEPTION_PATHS.CUSTOMER_LIST}
      titleToBack="Quay lại danh sách khách hàng"
    >
      <div className={cx("customer-detail-box")}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className={cx("customer-info")}>
              <h2>Thông tin khách hàng</h2>
              <div className={cx("info-grid")}>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Họ tên:</span>
                  <span className={cx("value")}>{customer?.name || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Email:</span>
                  <span className={cx("value")}>{customer?.email || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Số điện thoại:</span>
                  <span className={cx("value")}>{customer?.phoneNumber || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Quốc tịch:</span>
                  <span className={cx("value")}>{customer?.nationality || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Địa chỉ:</span>
                  <span className={cx("value")}>{customer?.address || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Ngày sinh:</span>
                  <span className={cx("value")}>{customer?.dateOfBirth ? moment.unix(customer.dateOfBirth).format("DD/MM/YYYY") : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Giới tính:</span>
                  <span className={cx("value")}>{customer?.gender || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>CCCD:</span>
                  <span className={cx("value")}>{customer?.identityNumber || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Ghi chú:</span>
                  <span className={cx("value")}>{customer?.notes || "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span className={cx("label")}>Tổng tiền đã thanh toán:</span>
                  <span className={cx("value")}>{totalPaid.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>
            <Divider style={{margin: "20px 0"}} />
            <div className={cx("invoice-list")}>
              <h2>Danh sách hóa đơn</h2>
              <DataGrid
                style={{ fontSize: "1.4rem", cursor: "pointer" }}
                className={cx("data")}
                rows={invoices}
                columns={columns}
                rowCount={invoices.length}
                disableColumnSorting={true}
                rowSelection={false}
                hideFooterPagination={true}
                onRowClick={(params) => handleViewInvoice(params.row)}
              />
            </div>
          </>
        )}
      </div>
      {selectedInvoice && selectedBooking && (
        <InvoiceModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          invoice={selectedInvoice}
          booking={selectedBooking}
        />
      )}
    </Container>
  );
};

export default CustomerDetail;
