import classNames from "classnames/bind";
import styles from "./Logo.module.scss";
import { useHotel } from "../../../hooks/useHotel";

const cx = classNames.bind(styles);

interface LogoProps {
  isCollapse?: boolean; // Đặt là tùy chọn để mặc định là false
}

const Logo: React.FC<LogoProps> = ({ isCollapse = false }) => {
  const { hotelInfo } = useHotel();

  return (
    <div className={cx("logoWrapper", { collapsed: isCollapse })}>
      <a href="/">
        <div className={cx("logo")}>
          <img src={hotelInfo?.logoUrl} alt="logo" className={cx("logoImg")} />
          {!isCollapse && (
            <div className={cx("hotelName")}>{hotelInfo?.name}</div>
          )}
        </div>
      </a>
    </div>
  );
};

export default Logo;
