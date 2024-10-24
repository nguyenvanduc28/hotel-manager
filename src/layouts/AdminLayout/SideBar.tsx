import React from "react";
import styles from "./SideBar.module.scss";
import classNames from "classnames/bind";
import Logo from "./component/Logo";
import Menu from "./component/Menu";
import MenuItem from "./component/MenuItem";
import SubMenu from "./component/SubMenu";
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
type SideBarProps = {
  isCollapse?: boolean;
};
const cx = classNames.bind(styles);
const SideBar: React.FC<SideBarProps> = ({ isCollapse = false }) => {
  return (
    <div className={cx("sidebar")}>
      <Logo isCollapse={isCollapse} />
      <div className={cx("menubox")}>
        <Menu title="Quản lý" isCollapse={isCollapse}>
          <MenuItem
            title="Tổng quan"
            icon={<DashboardOutlined />}
            link="/admin/dashboard"
            isCollapse={isCollapse}
          />
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
          </SubMenu>
          <MenuItem
            title="Đặt phòng"
            icon={<EventNoteOutlined />}
            link="/admin/bookings"
            isCollapse={isCollapse}
          />
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
            <MenuItem
              title="Vai trò nhân viên"
              link="/admin/roles"
              isCollapse={isCollapse}
            />
          </SubMenu>
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
        </Menu>
      </div>
      <div className={cx("hotel-setting")}>
        <Menu isCollapse={isCollapse}>
          <MenuItem
            title="Thông tin khách sạn"
            icon={<BusinessOutlined />}
            link="/admin/hotel-setting"
            isCollapse={isCollapse}
          />
        </Menu>
      </div>
    </div>
  );
};

export default SideBar;
