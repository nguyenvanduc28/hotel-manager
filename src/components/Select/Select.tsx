import React, { FC, SelectHTMLAttributes } from "react";
import styles from "./Select.module.scss";
import classNames from "classnames/bind";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  title?: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  note?: string;
  variant?: "inline" | "block" | "inline-group"; 
}

const cx = classNames.bind(styles);

const Select: FC<SelectProps> = ({
  title,
  value,
  onChange,
  options,
  note,
  variant = "block", 
  ...restProps
}) => {
  return (
    <div
      className={cx("select-wrapper", {
        inline: variant === "inline",
        "inline-group": variant === "inline-group",
      })}
    >
      {title && <span className={cx("title")}>{title}</span>}
      <div className={cx("select-container")}>
        <select
          className={cx("select")}
          value={value}
          onChange={onChange}
          {...restProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {note && <span className={cx("note")}>{note}</span>}
      </div>
    </div>
  );
};

export default Select;
