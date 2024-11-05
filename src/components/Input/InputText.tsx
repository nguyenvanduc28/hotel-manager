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
  variant?: "inline" | "block" | "inline-group";
  error?: string;
}

const cx = classNames.bind(styles);
const InputText: FC<InputTextProps> = ({
  placeholder = "Enter value",
  value = "",
  title,
  note,
  suffix,
  onChange,
  variant = "block",
  error,
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
        {!error && note && <span className={cx("note")}>{note}</span>}
        {error && <div className={cx('error-message')}>{error}</div>}
      </div>
    </div>
  );
};

export default InputText;
