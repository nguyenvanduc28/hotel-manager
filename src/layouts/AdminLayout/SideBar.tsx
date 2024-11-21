import React, { useContext } from "react";
import styles from "./SideBar.module.scss";
import classNames from "classnames/bind";
import Logo from "./component/Logo";
import Menu from "./component/Menu";
import MenuItem from "./component/MenuItem";
import SubMenu from "./component/SubMenu";
import AuthContext from "../../contexts/AuthContext";
import {
  AssessmentOutlined,
  BusinessOutlined,
  DashboardOutlined,
  EventNoteOutlined,
  HotelOutlined,
  Inventory2Outlined,
  PeopleOutlineOutlined,
  PersonOutlineOutlined,
  ReceiptOutlined,
  RoomServiceOutlined,
} from "@mui/icons-material";
import { ROLES } from "../../constants/auth/roleConstants";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types/hotel";
type SideBarProps = {
  isCollapse?: boolean;
};
const cx = classNames.bind(styles);
const hasRequiredRole = (userRoles: Role[] | undefined, requiredRoles: string[]): boolean => {
  if (!userRoles) return false;
  return userRoles?.some(role => 
    requiredRoles.includes(role.name)
  );
};

const SideBar: React.FC<SideBarProps> = ({ isCollapse = false }) => {
  const {user} = useAuth();

  return (
    <div className={cx("sidebar")}>
      <Logo isCollapse={isCollapse} />
      <div className={cx("menubox")}>
        <Menu title="Quản lý" isCollapse={isCollapse}>
          {/* Dashboard - Admin only */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN]) && (
            <MenuItem
              title="Tổng quan"
              icon={<DashboardOutlined />}
              link="/admin/dashboard"
              isCollapse={isCollapse}
            />
          )}

          {/* Room Management - Admin and Receptionist */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.RECEPTIONIST]) && (
            <SubMenu
              title="Quản lý phòng"
              icon={<HotelOutlined />}
              isCollapse={isCollapse}
            >
              <MenuItem
                title="Danh sách phòng"
                link="/admin/room-list"
                isCollapse={isCollapse}
              />
              <MenuItem
                title="Loại phòng"
                link="/admin/room-type"
                isCollapse={isCollapse}
              />
              <MenuItem
                title="Tiện nghi phòng"
                link="/admin/room-amenities"
                isCollapse={isCollapse}
              />
              <MenuItem
                title="Danh mục tiện nghi"
                link="/admin/room-amenities/categories"
                isCollapse={isCollapse}
              />
            </SubMenu>
          )}

          {/* Bookings - Admin and Receptionist */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.RECEPTIONIST]) && (
            <MenuItem
              title="Đặt phòng"
              icon={<EventNoteOutlined />}
              link="/admin/bookings"
              isCollapse={isCollapse}
            />
          )}

          {/* Staff Management - Admin and Staff Manager */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.STAFF_MANAGER]) && (
            <SubMenu
              title="Nhân viên"
              icon={<PeopleOutlineOutlined />}
              isCollapse={isCollapse}
            >
              <MenuItem
                title="Danh sách nhân viên"
                link="/admin/employees"
                isCollapse={isCollapse}
              />
            </SubMenu>
          )}

          {/* Customer Management - Admin and Customer Manager */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.CUSTOMER_MANAGER]) && (
            <SubMenu
              title="Khách hàng"
              icon={<PersonOutlineOutlined />}
              isCollapse={isCollapse}
            >
              <MenuItem
                title="Danh sách khách hàng"
                link="/admin/customers"
                isCollapse={isCollapse}
              />
            </SubMenu>
          )}

          {/* Services - Admin, Service Manager, and Service Counter */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.SERVICE_MANAGER, ROLES.SERVICE_COUNTER]) && (
            <SubMenu
              title="Dịch vụ"
              icon={<RoomServiceOutlined />}
              isCollapse={isCollapse}
            >
              <MenuItem
                title="Danh sách sử dụng"
                link="/admin/service-usage"
                isCollapse={isCollapse}
              />
              <MenuItem
                title="Danh sách dịch vụ"
                link="/admin/services"
                isCollapse={isCollapse}
              />
            </SubMenu>
          )}

          {/* Inventory - Admin and Warehouse Manager */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER]) && (
            <SubMenu
              title="Kho hàng"
              icon={<Inventory2Outlined />}
              isCollapse={isCollapse}
            >
              <MenuItem
                title="Tồn kho"
                link="/admin/inventory"
                isCollapse={isCollapse}
              />
              <MenuItem
                title="Lịch sử kho"
                link="/admin/inventory-history"
                isCollapse={isCollapse}
              />
            </SubMenu>
          )}

          {/* Reports - Admin and Report Manager */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.REPORT_MANAGER]) && (
            <SubMenu
              title="Báo cáo"
              icon={<AssessmentOutlined />}
              isCollapse={isCollapse}
            >
              <MenuItem
                title="Tổng hợp"
                link="/admin/report-summary"
                isCollapse={isCollapse}
              />
              <MenuItem
                title="Doanh thu dịch vụ"
                link="/admin/report-service-revenue"
                isCollapse={isCollapse}
              />
              <MenuItem
                title="Theo hóa đơn"
                link="/admin/report-bill-revenue"
                isCollapse={isCollapse}
              />
            </SubMenu>
          )}

          {/* Invoices - Admin and Invoice Manager */}
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.INVOICE_MANAGER]) && (
            <SubMenu
              title="Hóa đơn"
              icon={<ReceiptOutlined />}
              isCollapse={isCollapse}
            >
              <MenuItem
                title="Danh sách"
                link="/admin/invoices"
                isCollapse={isCollapse}
              />
            </SubMenu>
          )}
        </Menu>
      </div>

      {/* Hotel Settings - Admin and Hotel Info Manager */}
      <div className={cx("hotel-setting")}>
        <Menu isCollapse={isCollapse}>
          {hasRequiredRole(user?.roles, [ROLES.ADMIN, ROLES.HOTEL_INFO_MANAGER]) && (
            <MenuItem
              title="Thông tin khách sạn"
              icon={<BusinessOutlined />}
              link="/admin/hotel-setting"
              isCollapse={isCollapse}
            />
          )}
        </Menu>
      </div>
    </div>
  );
};

export default SideBar;
