import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./Employees.module.scss";
import classNames from "classnames/bind";
import Search from "../../../components/Search/Search";
import { StyledChip } from "../../../components/StyledChip/StyledChip";
import { EmployeeInfo } from "../../../types/hotel";
import { EMPLOYEE_STATUS, GENDERS } from "../../../constants/admin/constants";
import ShowInfoDialog from "../../../components/ShowInfoDialog/ShowInfoDialog";
import { useState } from "react";
const cx = classNames.bind(styles);

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
    field: "name",
    headerName: "Tên",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tên</span>,
    renderCell: (params) => <span>{params.row.name}</span>,
  },
  {
    field: "gender",
    headerName: "Giới tính",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giới tính</span>,
    renderCell: (params) => (
      <span>{params.row.gender === GENDERS.MALE ? "Nam" : "Nữ"}</span>
    ),
  },
  {
    field: "phoneNumber",
    headerName: "Số điện thoại",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số điện thoại</span>,
    renderCell: (params) => <span>{params.row.phoneNumber}</span>,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Trạng thái</span>,
    renderCell: (params) => (
      <StyledChip
        label={params.row.status}
        color={
          params.row.status === EMPLOYEE_STATUS.ACTIVE ? "success" : "error"
        }
      />
    ),
  },
  {
    field: "positionName",
    headerName: "Vị trí",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Vị trí</span>,
    renderCell: (params) => <span>{params.row.positionName}</span>,
  },
];

const data: EmployeeInfo[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    gender: "Nam",
    phoneNumber: "0123456789",
    status: "Đang làm việc",
    positionName: "Quản lý",
    dateOfBirth: 19900101,
    nationalId: "123456789",
    email: "nguyenvana@email.com",
    address: "123 Đường ABC, Quận XYZ",
    startDate: "2022-01-15",
    profilePictureUrl: "",
    emergencyContactName: "Nguyễn Thị B",
    emergencyContactRelationship: "Mẹ",
    emergencyContactPhone: "0987654321",
    notes: "Rất chăm chỉ",
    roles: [
      { id: 1, name: "ADMIN" },
      { id: 2, name: "RECEPTIONIST" },
    ],
  },
  {
    id: "2",
    name: "Trần Thị B",
    gender: "Nữ",
    phoneNumber: "0987654321",
    status: "Đã nghỉ việc",
    positionName: "Nhân viên",
    dateOfBirth: 19891231,
    nationalId: "987654321",
    email: "tranthib@email.com",
    address: "456 Đường DEF, Quận ABC",
    startDate: "2020-06-20",
    profilePictureUrl: "",
    emergencyContactName: "Trần Văn C",
    emergencyContactRelationship: "Cha",
    emergencyContactPhone: "0123456789",
    notes: "Có kinh nghiệm lâu năm",
    roles: [{ id: 2, name: "Employee" }],
  },
  // Thêm các nhân viên khác vào đây
];
const Employees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeInfo | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  const handleRowClick = (params: any) => {
    setSelectedEmployee(params.row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleSearch = (input: any) => {
    console.log("Tìm kiếm:", input);
  };

  return (
    <Container
      title="Danh sách nhân viên"
      button={
        <Button
          content="Thêm nhân viên"
          onClick={() => console.log("Thêm nhân viên")}
        />
      }
    >
      <div className={cx("employee-list-box")}>
        <div className={cx("search")}>
          <Search placeholder="Tìm kiếm nhân viên" onSearch={handleSearch} />
        </div>
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem", cursor: "pointer" }}
            className={cx("data")}
            rows={data}
            columns={columns}
            rowCount={data.length}
            onRowClick={handleRowClick}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </div>
      </div>

      {selectedEmployee && (
        <ShowInfoDialog
          open={openDialog}
          onClose={handleCloseDialog}
          title="Thông tin nhân viên"
        >
          <div>
            <p>
              <strong>ID:</strong> {selectedEmployee.id}
            </p>
            <p>
              <strong>Tên:</strong> {selectedEmployee.name}
            </p>
            <p>
              <strong>Giới tính:</strong> {selectedEmployee.gender}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {selectedEmployee.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {selectedEmployee.email}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {selectedEmployee.address}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {selectedEmployee.dateOfBirth}
            </p>
            <p>
              <strong>Mã số nhân viên:</strong> {selectedEmployee.nationalId}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedEmployee.status}
            </p>
            <p>
              <strong>Ngày bắt đầu:</strong> {selectedEmployee.startDate}
            </p>
            <p>
              <strong>Chức vụ:</strong> {selectedEmployee.positionName}
            </p>
            <p>
              <strong>Người liên hệ khẩn cấp:</strong>{" "}
              {selectedEmployee.emergencyContactName} (
              {selectedEmployee.emergencyContactRelationship})
            </p>
            <p>
              <strong>Số điện thoại khẩn cấp:</strong>{" "}
              {selectedEmployee.emergencyContactPhone}
            </p>
            <p>
              <strong>Ghi chú:</strong> {selectedEmployee.notes}
            </p>
            {selectedEmployee.roles && selectedEmployee.roles.length > 0 && (
              <p>
                <strong>Vai trò:</strong>{" "}
                {selectedEmployee.roles.map((role) => role.name).join(", ")}
              </p>
            )}
          </div>
        </ShowInfoDialog>
      )}
    </Container>
  );
};

export default Employees;
