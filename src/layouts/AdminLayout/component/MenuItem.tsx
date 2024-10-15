import classNames from "classnames/bind";
import styles from "./MenuItem.module.scss";
import { ReactElement } from "react";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);

type MenuItemProp = {
  icon?: ReactElement;
  link: string;
  isCollapse?: boolean;
  title: string;
};
const MenuItem: React.FC<MenuItemProp> = ({
  icon,
  link,
  title,
  isCollapse,
}) => {
  return (
    <li className={cx("menuItem")}>
      <Link to={link}>
        <span className={cx("menuItem-icon")}>{icon ? icon : ""}</span>

        {!isCollapse && <span className={cx("menuItem-title")}>{title}</span>}
      </Link>
    </li>
  );
};

export default MenuItem;
