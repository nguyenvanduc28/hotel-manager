import { useAuth } from "../../hooks/useAuth";
import { User } from "../../types/auth";
import styles from "./Order.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Order = ({reloadCount}: {reloadCount: () => void}) => {
  const { user } = useAuth();

  return <div className={cx("order")}>Order</div>;
};

export default Order;
