import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import FormatIndentDecreaseOutlinedIcon from "@mui/icons-material/FormatIndentDecreaseOutlined";
import FormatIndentIncreaseOutlinedIcon from "@mui/icons-material/FormatIndentIncreaseOutlined";
import { useAuth } from "../../hooks/useAuth";
import { Avatar, Button } from "@mui/material";
import { useState } from "react";
const cx = classNames.bind(styles);
const Header = ({
  isCollapse,
  onCollapse,
}: {
  isCollapse: boolean;
  onCollapse: Function;
}) => {
  const {employeeInfo, logout} = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={cx("headerWrapper")}>
      <button
        className={cx("button-collapse")}
        onClick={() => onCollapse(!isCollapse)}
      >
        {isCollapse ? (
          <FormatIndentIncreaseOutlinedIcon />
        ) : (
          <FormatIndentDecreaseOutlinedIcon />
        )}
      </button>
      <div className={cx("header-account")}>
        <div className={cx("header-account-info")} onClick={() => setOpen(true)}>
          <Avatar src={employeeInfo?.profilePictureUrl} />
          <span>{employeeInfo?.name}</span>
        </div>

        {open && (
          <div className={cx("header-account-logout")}>
            <Button variant="contained" color="error" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
