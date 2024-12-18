import styles from "./ServiceCounterLayout.module.scss";
import classNames from "classnames/bind";
import { BOOKING_SERVICE_ORDER_STATUS, SERVICE_TYPE } from "../../constants/admin/constants";
import { Avatar } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { AddBoxOutlined, Logout } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Order from "./Order";
import ServiceScreen from "./ServiceScreen";
import { getServiceCount } from "../../apis/serviceApis";

const cx = classNames.bind(styles);

const ServiceCounterLayout = () => {
  const { user, employeeInfo, logout } = useAuth();
  const [tab, setTab] = useState<string>(BOOKING_SERVICE_ORDER_STATUS.NEW);
  const [numOfStatus, setNumOfStatus] = useState<{ [key: string]: number }>({
    [BOOKING_SERVICE_ORDER_STATUS.NEW]: 0,
    [BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS]: 0,
    [BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE]: 0,
  });
  const serviceTypeId = user?.roles.find(role => role.name === "BAR_COUNTER") 
    ? SERVICE_TYPE.BAR 
    : user?.roles.find(role => role.name === "RESTAURANT_COUNTER")
    ? SERVICE_TYPE.RESTAURANT
    : undefined;

  const reloadCount = () => {
    getServiceCount(serviceTypeId || 0).then((res) => {
      setNumOfStatus({
        [BOOKING_SERVICE_ORDER_STATUS.NEW]: res.numOfNewOrder,
        [BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS]: res.numOfInProgressOrder,
        [BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE]: res.numOfReadyToServeOrder,
      });
    });
  }

  useEffect(() => {
    reloadCount();
    const interval = setInterval(() => {
      reloadCount();
    }, 20000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={cx("service-counter-layout")}>
      <div className={cx("service-counter-layout__header")}>
        <div className={cx("service-counter-layout__header-left")}>
          <div 
            className={cx("service-counter-layout__header-left-new-order")} 
            onClick={() => setTab("ORDER")}
          >
            <AddBoxOutlined />
            NEW ORDER
          </div>
          {Object.values(BOOKING_SERVICE_ORDER_STATUS).map((status) => (
            <div
              key={status}
              className={cx(
                "service-counter-layout__header-left-status",
                tab === status && "active"
              )}
              onClick={() => setTab(status)}
            >
              {status}
              {numOfStatus[status] > 0 && <span className={cx("service-counter-layout__header-left-status-number")}>{numOfStatus[status]}</span>}
            </div>
          ))}
        </div>
        <div className={cx("service-counter-layout__header-right")}>
          <div className={cx("service-counter-layout__header-right-avatar")}>
            <Avatar src={employeeInfo?.profilePictureUrl} alt={employeeInfo?.name} />
          </div>
          <div className={cx("service-counter-layout__header-right-name")}>
            <span>
              {employeeInfo?.name} - {user?.roles[0].name}
            </span>
            <div className={cx("service-counter-layout__header-right-logout")}>
              <Logout sx={{ fontSize: "2.4rem" }} onClick={logout}/>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("service-counter-layout__content")}>
        {tab === "ORDER" && <Order reloadCount={reloadCount}/>}
        {tab !== "ORDER" && <ServiceScreen status={tab} reloadCount={reloadCount} numOfStatus={numOfStatus}/>}
      </div>
    </div>
  );
};

export default ServiceCounterLayout;
