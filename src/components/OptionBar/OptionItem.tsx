import classNames from "classnames/bind";
import styles from "./OptionItem.module.scss";
import React from "react";

const cx = classNames.bind(styles);

type OptionItemProps = {
  title?: string;
  onClick?: () => void;
  active?: boolean;
};

const OptionItem: React.FC<OptionItemProps> = ({
  title,
  onClick,
  active = false,
}) => {
  return (
    <div className={cx("optionitem-wrapper")}>
      <button
        className={cx("optionitem", { active: active })}
        onClick={onClick ? () => onClick() : undefined}
        disabled={active}
      >
        {title}
      </button>
    </div>
  );
};

export default OptionItem;
