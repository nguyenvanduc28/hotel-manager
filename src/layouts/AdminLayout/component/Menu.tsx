import classNames from "classnames/bind";
import styles from "./Menu.module.scss";
import { ReactNode } from "react";

const cx = classNames.bind(styles);
const Menu = ({
  title,
  isCollapse,
  children,
}: {
  title?: string;
  isCollapse?: boolean;
  children: ReactNode;
}) => {
  return (
    <div className={cx("menuWrapper")}>
      {title && !isCollapse && <span className={cx("menuTitle")}>{title}</span>}
      <ul className={cx("menuList")}>{children}</ul>
    </div>
  );
};

export default Menu;
