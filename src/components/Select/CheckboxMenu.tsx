import React, { FC, useState } from "react";
import styles from "./CheckboxMenu.module.scss";
import classNames from "classnames/bind";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Option {
  value: number | undefined;
  label: string | undefined;
}

interface CheckboxMenuProps {
  title?: string;
  value: number[] | undefined;
  onChange: (value: number[]) => void;
  options: Option[];
  note?: string;
}

const cx = classNames.bind(styles);

const CheckboxMenu: FC<CheckboxMenuProps> = ({
  title,
  value = [],
  onChange,
  options,
  note,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: number | undefined) => {
    if (optionValue === undefined) return;

    // Kiểm tra xem optionValue đã tồn tại trong value chưa
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue) // Nếu có thì loại bỏ nó
      : [...value, optionValue]; // Nếu không thì thêm vào

    onChange(newValue);
  };

  return (
    <div className={cx("select-container")}>
      <div
        className={cx("select-box")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {title}
        <KeyboardArrowDownIcon className={cx("icon")} />
      </div>
      {isOpen && (
        <div className={cx("options-list")}>
          {options.map((option) => (
            <label key={option.value} className={cx("option")}>
              <input
                type="checkbox"
                checked={value.includes(option.value!)}
                onChange={() => handleSelect(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
      {note && <span className={cx("note")}>{note}</span>}
    </div>
  );
};

export default CheckboxMenu;
