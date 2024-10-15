import React from "react";
import styles from "./SideBar.module.scss";
import classNames from "classnames/bind";
import Logo from "./component/Logo";
import Menu from "./component/Menu";
import MenuItem from "./component/MenuItem";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SubMenu from "./component/SubMenu";
type SideBarProps = {
  isCollapse?: boolean;
};
const cx = classNames.bind(styles);
const SideBar: React.FC<SideBarProps> = ({ isCollapse = false }) => {
  return (
    <div className={cx("sidebar")}>
      <Logo isCollapse={isCollapse} />
      <Menu title="Quản lý" isCollapse={isCollapse}>
        <MenuItem
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          link="/admin/test"
          isCollapse={isCollapse}
        />
        <MenuItem
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          link="/admin/test"
          isCollapse={isCollapse}
        />
        <MenuItem
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          link="/admin/test"
          isCollapse={isCollapse}
        />
        <SubMenu
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          isCollapse={isCollapse}
        >
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
        </SubMenu>
        <SubMenu
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          isCollapse={isCollapse}
        >
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
        </SubMenu>
        <SubMenu
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          isCollapse={isCollapse}
        >
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
        </SubMenu>
        <SubMenu
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          isCollapse={isCollapse}
        >
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
        </SubMenu>
        <SubMenu
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          isCollapse={isCollapse}
        >
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
          <MenuItem
            title="Quản lý phòng2"
            link="/admin/test"
            isCollapse={isCollapse}
          />
        </SubMenu>
        <MenuItem
          title="Quản lý phòng"
          icon={<AddBusinessIcon />}
          link="/admin/test"
          isCollapse={isCollapse}
        />
      </Menu>
    </div>
  );
};

export default SideBar;
