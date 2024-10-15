import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";

const cx = classNames.bind(styles);

const AdminLayout: React.FC = () => {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  return (
    <div className={cx("adminLayoutWrapper")}>
      <div
        className={cx("sidebarWrapper")}
        style={{ width: `${isCollapse ? 60 : 270}px` }}
      >
        <SideBar isCollapse={isCollapse} />
      </div>
      <div className={cx("contentWrapper")}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
