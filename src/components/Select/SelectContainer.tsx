import React, { FC, useState } from "react";
import styles from "./SelectContainer.module.scss";
import classNames from "classnames/bind";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Option {
  value: string | number | undefined;
  label: string | undefined;
}

interface SelectContainerProps {
  title?: string;
  value: string | number | undefined;
  onChange: (value: any) => void;
  options: Option[];
  note?: string;
}

const cx = classNames.bind(styles);

const SelectContainer: FC<SelectContainerProps> = ({
  title,
  value,
  onChange,
  options,
  note,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={cx("select-container")}>
      {title && <span className={cx("title")}>{title}</span>}
      <div
        className={cx("select-box")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value !== undefined && options.some((option) => option.value === value)
          ? options.find((option) => option.value === value)?.label
          : "Chọn một tùy chọn"}
        <KeyboardArrowDownIcon className={cx("icon")} />
      </div>
      {isOpen && (
        <div className={cx("options-list")}>
          {options.map((option) => (
            <div
              key={option.value}
              className={cx("option")}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {note && <span className={cx("note")}>{note}</span>}
    </div>
  );
};

export default SelectContainer;
