import styles from "./ServiceCounterLayout.module.scss";
import classNames from "classnames/bind";
import { BOOKING_SERVICE_ORDER_STATUS, SERVICE_TYPE } from "../../constants/admin/constants";
import { Avatar } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { AddBoxOutlined, Logout } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import Order from "./Order";
import ServiceScreen from "./ServiceScreen";
import { getServiceCount, getServiceTypeList } from "../../apis/serviceApis";
import { ServiceType } from "../../types/hotel";

const cx = classNames.bind(styles);

const ServiceCounterLayout = () => {
  const { user, employeeInfo, logout } = useAuth();
  const [tab, setTab] = useState<string>(BOOKING_SERVICE_ORDER_STATUS.NEW);
  const [numOfStatus, setNumOfStatus] = useState<{ [key: string]: number }>({
    [BOOKING_SERVICE_ORDER_STATUS.NEW]: 0,
    [BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS]: 0,
    [BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE]: 0,
  });
  const [serviceTypeList, setServiceTypes] = useState<ServiceType[]>([]);
  const [serviceTypeId, setServiceTypeId] = useState(0);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const types = await getServiceTypeList();
        setServiceTypes(types);

        if (user?.roles.find(role => role.name === "BAR_COUNTER")) {
          console.log("BAR_COUNTER");
          
          const svId = types.find((sv: ServiceType) => sv.name === "Quầy Bar").id;
          console.log(svId);
          
          setServiceTypeId(svId);
        }
        if (user?.roles.find(role => role.name === "RESTAURANT_COUNTER")) {
          console.log("RESTAURANT_COUNTER");
          
          const svId = types.find((sv: ServiceType) => sv.name === "Nhà hàng").id;
          console.log(svId);
          
          setServiceTypeId(svId);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại dịch vụ:", error);
      }
    };
    fetchServiceTypes();
  }, []);
  const reloadCount = useCallback(() => {
    console.log(serviceTypeId);
    
    getServiceCount(serviceTypeId).then((res) => {
      setNumOfStatus({
        [BOOKING_SERVICE_ORDER_STATUS.NEW]: res.numOfNewOrder,
        [BOOKING_SERVICE_ORDER_STATUS.IN_PROGRESS]: res.numOfInProgressOrder,
        [BOOKING_SERVICE_ORDER_STATUS.READY_TO_SERVE]: res.numOfReadyToServeOrder,
      });
    });
  }, [serviceTypeId])

  useEffect(() => {
    reloadCount();
    const interval = setInterval(() => {
      reloadCount();
    }, 20000);
    return () => clearInterval(interval);
  }, [serviceTypeId]);
  
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
