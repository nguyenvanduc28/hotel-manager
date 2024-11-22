import { CircularProgress } from "@mui/material";
import styles from "./Loading.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Loading = () => {
  return (
    <div className={cx("loading-container")}>
      <CircularProgress size={40} />
      <p className={cx("loading-text")}>Đang tải dữ liệu...</p>
    </div>
  );
};

export default Loading; 