// SelectOption.tsx
import React, { FC } from "react";
import styles from "./SelectOption.module.scss";
import classNames from "classnames/bind";

interface SelectOptionProps {
  value: string | number;
  label: string;
  onSelect: (value: string | number) => void;
}

const cx = classNames.bind(styles);

const SelectOption: FC<SelectOptionProps> = ({ value, label, onSelect }) => {
  return (
    <div className={cx("menu-item")} onClick={() => onSelect(value)}>
      {label}
    </div>
  );
};

export default SelectOption;
