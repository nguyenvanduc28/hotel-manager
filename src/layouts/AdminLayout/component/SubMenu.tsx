import classNames from "classnames/bind";
import styles from "./SubMenu.module.scss";
import { ReactElement, ReactNode, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
const cx = classNames.bind(styles);

type SubMenuProp = {
  icon?: ReactElement;
  isCollapse?: boolean;
  title: string;
  children?: ReactNode;
};
const SubMenu: React.FC<SubMenuProp> = ({
  icon,
  title,
  isCollapse,
  children,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  return (
    <>
      <li
        className={cx("submenu")}
        onClick={() => {
          !isCollapse && setOpenMenu((prev) => !prev);
        }}
      >
        <div className={cx("submenu-wrapper")}>
          <div className={cx("submenu-container")}>
            <span className={cx("submenu-icon")}>{icon ? icon : ""}</span>
            {!isCollapse && (
              <span className={cx("submenu-title")}>{title}</span>
            )}
          </div>
          <div className={cx("submenu-arrow-collapse")}>
            {openMenu ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
        </div>
      </li>
      <ul
        className={cx("submenu-item-list", openMenu && !isCollapse && "show")}
      >
        {children}
      </ul>
    </>
  );
};

export default SubMenu;
