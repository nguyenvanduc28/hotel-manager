import styles from "./ServiceCounterLayout.module.scss";
import classNames from "classnames/bind";
import { BOOKING_SERVICE_ORDER_STATUS } from "../../constants/admin/constants";
import { Avatar } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { Logout } from "@mui/icons-material";
import { useState } from "react";

const cx = classNames.bind(styles);

const ServiceCounterLayout = () => {
  const { user, employeeInfo } = useAuth();
  const [tab, setTab] = useState<string>(BOOKING_SERVICE_ORDER_STATUS.NEW);

  return (
      <div className={cx("service-counter-layout")}>
        <div className={cx("service-counter-layout__header")}>
          <div className={cx("service-counter-layout__header-left")}>
            {Object.values(BOOKING_SERVICE_ORDER_STATUS).map((status) => (
              <div key={status} className={cx("service-counter-layout__header-left-status", tab === status && "active")} onClick={() => setTab(status)}>
                {status}
              </div>
            ))}
          </div>
          <div className={cx("service-counter-layout__header-right")}>
            <div className={cx("service-counter-layout__header-right-avatar")}>
              <Avatar src={employeeInfo?.profilePictureUrl} alt={employeeInfo?.name} />
            </div>
            <div className={cx("service-counter-layout__header-right-name")}>
              <span>{employeeInfo?.name} - {user?.roles[0].name}</span>
              <div className={cx("service-counter-layout__header-right-logout")}>
                <Logout />
              </div>
            </div>
          </div>
        </div>

        <div className={cx("service-counter-layout__content")}>
          
        </div>
      </div>
  );
};

export default ServiceCounterLayout;
