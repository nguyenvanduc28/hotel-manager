import React, { FC, InputHTMLAttributes } from "react";
import styles from "./InputText.module.scss";
import classNames from "classnames/bind";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  note?: string;
  suffix?: string;
  variant?: "inline" | "block" | "inline-group"; // Thêm prop variant
}

const cx = classNames.bind(styles);
const InputText: FC<InputTextProps> = ({
  placeholder = "Enter value",
  value = "", // Đặt giá trị mặc định rỗng nếu value là undefined
  title,
  note,
  suffix,
  onChange,
  variant = "block", // Đặt giá trị mặc định là "block"
  ...restProps
}) => {
  return (
    <div
      className={cx("text-wrapper", {
        inline: variant === "inline",
        "inline-group": variant === "inline-group",
      })}
    >
      {title && <span className={cx("title")}>{title}</span>}
      <div className={cx("input-container")}>
        <input
          type="text"
          className={cx("text")}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...restProps}
        />
        {suffix && <span className={cx("suffix")}>{suffix}</span>}
        {note && <span className={cx("note")}>{note}</span>}
      </div>
    </div>
  );
};

export default InputText;
