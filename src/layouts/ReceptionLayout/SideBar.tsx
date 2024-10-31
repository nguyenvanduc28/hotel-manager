import React from "react";
import styles from "./SideBar.module.scss";
import classNames from "classnames/bind";
import Logo from "../AdminLayout/component/Logo";
import Menu from "../AdminLayout/component/Menu";
import MenuItem from "../AdminLayout/component/MenuItem";
import {
  EventNoteOutlined,
  HotelOutlined,
  PersonOutlineOutlined,
  ReceiptOutlined,
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
        <Menu title="Lễ tân" isCollapse={isCollapse}>
          <MenuItem
            title="Đặt phòng"
            icon={<EventNoteOutlined />}
            link="/reception/booking/create"
            isCollapse={isCollapse}
          />
          
          <MenuItem
            title="Danh sách đặt phòng"
            icon={<EventNoteOutlined />}
            link="/reception/booking/list"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Danh sách phòng"
            link="/reception/room/list"
            isCollapse={isCollapse}
            icon={<HotelOutlined />}
          />
          <MenuItem
            title="Danh sách khách hàng"
            link="/reception/customers"
            isCollapse={isCollapse}
            icon={<PersonOutlineOutlined />}
          />
          <MenuItem
            title="Danh sách hóa đơn"
            link="/reception/invoices"
            icon={<ReceiptOutlined />}
            isCollapse={isCollapse}
          />
        </Menu>
      </div>
      <div className={cx("hotel-setting")}>
      </div>
    </div>
  );
};

export default SideBar;
