import classNames from "classnames/bind";
import styles from "./Logo.module.scss";
import { useHotel } from "../../../hooks/useHotel";

const cx = classNames.bind(styles);

interface LogoProps {
  isCollapse?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isCollapse = false }) => {
  const { hotelInfo } = useHotel();

  return (
    <div className={cx("logoWrapper")}>
      <a href="/">
        <div className={cx("logo")}>
          <img src={hotelInfo?.logoUrl || "/HOTEL_BOOKING.png"} alt="logo" className={cx("logoImg")} />
          {!isCollapse && (
            <div className={cx("hotelName")}>{hotelInfo?.name || "Hotel Name"}</div>
          )}
        </div>
      </a>
    </div>
  );
};

export default Logo;
