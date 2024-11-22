import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import styles from "./InvoiceList.module.scss";
import classNames from "classnames/bind";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Search from "../../../components/Search/Search";
import { Booking, Invoice } from "../../../types/hotel";
import { getAllInvoices } from "../../../apis/invoiceApis/invoiceApis";
import moment from "moment";
import InvoiceModal from "../../../components/InvoiceModal/InvoiceModal";
import { Visibility } from "@mui/icons-material";
import { getBookingById } from "../../../apis/bookingApis/bookingApis";
import { IconButton } from "@mui/material";
import Loading from "../../../components/Loading/Loading";

const cx = classNames.bind(styles);

const InvoiceList = () => {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoices = await getAllInvoices();
        setData(invoices);
      } catch (error) {
        console.error("Lấy danh sách hóa đơn thất bại:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleSearch = (input: string) => {
    console.log(input);
  };

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
      field: "customerName",
      headerName: "Khách hàng",
      flex: 1,
      headerClassName: "datagrid-header",
      cellClassName: "datagrid-cell",
      renderCell: (params) => <span>{params.row.customer?.name}</span>,
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

  return (
    <Container
    //   fullscreen
      title="Danh sách hóa đơn"
    >
      <div className={cx("invoice-list-box")}>
        <div className={cx("search")}>
          <Search 
            placeholder="Tìm kiếm hóa đơn" 
            handleSearch={(query) => handleSearch(query)} 
          />
        </div>
        <div className={cx("list")}>
          {loading ? (
            <Loading />
          ) : (
            <DataGrid
              style={{ fontSize: "1.4rem", cursor: "pointer" }}
              className={cx("data")}
              rows={data}
              columns={columns}
              rowCount={data.length}
              disableColumnSorting={true}
              rowSelection={false}
              hideFooterPagination={true}
              onRowClick={(params) => handleViewInvoice(params.row)}
            />
          )}
        </div>
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

export default InvoiceList;
