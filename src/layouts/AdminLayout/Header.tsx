import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import FormatIndentDecreaseOutlinedIcon from "@mui/icons-material/FormatIndentDecreaseOutlined";
import FormatIndentIncreaseOutlinedIcon from "@mui/icons-material/FormatIndentIncreaseOutlined";
import { useAuth } from "../../hooks/useAuth";
import { Avatar, Button, DialogActions, DialogTitle, Dialog } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    setOpenLogoutDialog(false);
    logout();
  };

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
        <div className={cx("header-account-info")} onClick={() => setOpen(prev => !prev)}>
          <Avatar src={employeeInfo?.profilePictureUrl} />
          <span>{employeeInfo?.name}</span>
        </div>

        {open && (
          <div className={cx("header-account-logout")}>
            <ul className={cx("header-account-logout-list")}>
              <li className={cx("header-account-logout-item")}>
                <Link to={`/admin/employees/action?mode=edit&id=${employeeInfo?.id}`}>
                  Chỉnh sửa thông tin
                </Link>
              </li>
              <li className={cx("header-account-logout-item")}>
                <span onClick={() => setOpenLogoutDialog(true)}>
                  Đăng xuất
                </span>
              </li>
            </ul>
          </div>
        )}

        <Dialog
          sx={{
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
          }}
          open={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
        >
          <DialogTitle fontSize="16px">Bạn có chắc chắn muốn đăng xuất?</DialogTitle>
          <DialogActions>
            <Button sx={{fontSize: "14px"}} onClick={() => setOpenLogoutDialog(false)}>Hủy</Button>
            <Button sx={{fontSize: "14px"}} onClick={handleLogout} component={Link} to="/login" color="error">
              Đăng xuất
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Header;
