import { ReactNode } from "react";
import SideBar from "./SideBar";
import Header from "./Header";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReceptionLayout.module.scss";
import { Outlet } from "react-router-dom";
const cx = classNames.bind(styles);

const ReceptionLayout: React.FC = () => {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  return (
    <div className={cx("receptionLayoutWrapper")}>
      <div
        className={cx("sidebarWrapper")}
        style={{ width: `${isCollapse ? 60 : 270}px` }}
      >
        <SideBar isCollapse={isCollapse} />
      </div>
      <div className={cx("contentWrapper")}>
        <Header
          isCollapse={isCollapse}
          onCollapse={setIsCollapse}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default ReceptionLayout;
