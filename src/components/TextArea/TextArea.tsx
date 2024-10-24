import React, { FC, TextareaHTMLAttributes } from "react";
import styles from "./TextArea.module.scss";
import classNames from "classnames/bind";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  title?: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  note?: string;
  suffix?: string; 
}

const cx = classNames.bind(styles);
const TextArea: FC<TextAreaProps> = ({
  placeholder = "Enter value",
  value,
  title,
  note,
  suffix, 
  onChange,
  ...restProps
}) => {
  return (
    <div className={cx("text-wrapper")}>
      {title && <span className={cx("title")}>{title}</span>}
      <div className={cx("input-container")}>
        <textarea
          className={cx("textarea")}
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

export default TextArea;
