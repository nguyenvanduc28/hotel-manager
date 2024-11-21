import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import styles from "./Employees.module.scss";
import classNames from "classnames/bind";
import Search from "../../../components/Search/Search";
import { StyledChip } from "../../../components/StyledChip/StyledChip";
import { EmployeeInfo } from "../../../types/forms";
import { EMPLOYEE_STATUS, GENDERS } from "../../../constants/admin/constants";
import ShowInfoDialog from "../../../components/ShowInfoDialog/ShowInfoDialog";
import { useEffect, useState } from "react";
import { getAllEmployees } from "../../../apis/employeeApis";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { useNavigate } from "react-router-dom";
import moment from "moment";
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
    field: "profilePictureUrl",
    headerName: "Ảnh",
    flex: 0.8,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Ảnh</span>,
    renderCell: (params) => (
      <img 
        src={params.row.profilePictureUrl || '/default-avatar.png'} 
        alt="Avatar"
        style={{ 
          marginTop:"3px",
          width: '40px', 
          height: '40px', 
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
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

const Employees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeInfo | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [employees, setEmployees] = useState<EmployeeInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await getAllEmployees();
        setEmployees(response);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
          onClick={() => navigate("/admin/" + ADMIN_PATHS.EMPLOYEE_ACTION + "?mode=create")}
        />
      }
    >
      <div className={cx("employee-list-box")}>
        <div className={cx("search")}>
          <Search placeholder="Tìm kiếm nhân viên" handleSearch={(q) => handleSearch} />
        </div>
        <div className={cx("list")}>
          <DataGrid
            loading={loading}
            style={{ fontSize: "1.4rem", cursor: "pointer" }}
            className={cx("data")}
            rows={employees}
            columns={columns}
            rowCount={employees.length}
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
          isEditButton={true}
          onClickEditButton={() => navigate("/admin/" + ADMIN_PATHS.EMPLOYEE_ACTION + "?mode=edit&id=" + selectedEmployee.id)}
          editButtonText="Sửa"
        >
          <div className={cx("employee-info-dialog")}>
            <div className={cx("info-header")}>
              <img 
                src={selectedEmployee.profilePictureUrl || '/default-avatar.png'}
                alt={selectedEmployee.name}
                className={cx("avatar")}
              />
              <div className={cx("basic-info")}>
                <h2>{selectedEmployee.name}</h2>
                <p className={cx("position")}>{selectedEmployee.positionName ? selectedEmployee.positionName : "_"}</p>
                <StyledChip
                  label={selectedEmployee.status}
                  color={selectedEmployee.status === EMPLOYEE_STATUS.ACTIVE ? "success" : "error"}
                />
              </div>
            </div>

            <div className={cx("info-grid")}>
              <div className={cx("info-section")}>
                <h3>Thông tin cá nhân</h3>
                <div className={cx("info-item")}>
                  <span>ID:</span>
                  <span>{selectedEmployee.id}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Giới tính:</span>
                  <span>{selectedEmployee.gender}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Ngày sinh:</span>
                  <span>{selectedEmployee.birthDay ? moment.unix(selectedEmployee.birthDay).format("DD/MM/YYYY") : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Số điện thoại:</span>
                  <span>{selectedEmployee.phoneNumber ? selectedEmployee.phoneNumber : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Email:</span>
                  <span>{selectedEmployee.email ? selectedEmployee.email : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Địa chỉ:</span>
                  <span>{selectedEmployee.address ? selectedEmployee.address : "_"}</span>
                </div>
              </div>

              <div className={cx("info-section")}>
                <h3>Thông tin công việc</h3>
                <div className={cx("info-item")}>
                  <span>CCCD:</span>
                  <span>{selectedEmployee.identityNumber ? selectedEmployee.identityNumber : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Ngày bắt đầu:</span>
                  <span>{selectedEmployee.startDate ? moment.unix(selectedEmployee.startDate).format("DD/MM/YYYY") : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Vai trò:</span>
                  <span>
                    {selectedEmployee.roles?.map((role) => role.name).join(", ") || "Chưa có"}
                  </span>
                </div>
              </div>

              <div className={cx("info-section")}>
                <h3>Thông tin liên hệ khẩn cấp</h3>
                <div className={cx("info-item")}>
                  <span>Người liên hệ:</span>
                  <span>{selectedEmployee.emergencyContactName ? selectedEmployee.emergencyContactName : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Mối quan hệ:</span>
                  <span>{selectedEmployee.emergencyContactRelationship ? selectedEmployee.emergencyContactRelationship : "_"}</span>
                </div>
                <div className={cx("info-item")}>
                  <span>Số điện thoại:</span>
                  <span>{selectedEmployee.emergencyContactPhone ? selectedEmployee.emergencyContactPhone : "_"}</span>
                </div>
              </div>

              {selectedEmployee.notes && (
                <div className={cx("info-section", "full-width")}>
                  <h3>Ghi chú</h3>
                  <p className={cx("notes")}>{selectedEmployee.notes ? selectedEmployee.notes : "_"}</p>
                </div>
              )}
            </div>
          </div>
        </ShowInfoDialog>
      )}
    </Container>
  );
};

export default Employees;
