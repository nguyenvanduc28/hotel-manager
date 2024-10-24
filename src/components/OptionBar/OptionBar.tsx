import classNames from "classnames/bind";
import styles from "./OptionBar.module.scss";
import React, { ReactNode } from "react";
const cx = classNames.bind(styles);
type OptionBarProps = {
  children: ReactNode;
};
const OptionBar: React.FC<OptionBarProps> = ({ children }) => {
  return (
    <div className={cx("optionbar-wrapper")}>
      <div className={cx("optionbar-list")}>{children}</div>
    </div>
  );
};

export default OptionBar;
