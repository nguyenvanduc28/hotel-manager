import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import FormatIndentDecreaseOutlinedIcon from "@mui/icons-material/FormatIndentDecreaseOutlined";
import FormatIndentIncreaseOutlinedIcon from "@mui/icons-material/FormatIndentIncreaseOutlined";
const cx = classNames.bind(styles);
const Header = ({
  isCollapse,
  onCollapse,
}: {
  isCollapse: boolean;
  onCollapse: Function;
}) => {
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
      <div className={cx("header-menu")}></div>
    </div>
  );
};

export default Header;
