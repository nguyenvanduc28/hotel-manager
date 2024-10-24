import { FC } from "react";
import styles from "./GroupRadio.module.scss";
import classNames from "classnames/bind";

interface Option {
  label: string;
  value: string;
}

interface GroupRadioProps {
  title?: string;
  value: string | undefined;
  onSelect: (value: string) => void;
  options: Option[];
  numOfRow?: number;
}

const cx = classNames.bind(styles);

const GroupRadio: FC<GroupRadioProps> = ({
  title,
  value,
  onSelect,
  options,
  numOfRow = 3,
}) => {
  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
  };

  return (
    <div className={cx("radio-wrapper")}>
      {title && <span className={cx("title")}>{title}</span>}
      <div
        className={cx("radio-group")}
        style={{
          gridTemplateColumns: `repeat(${numOfRow}, 1fr)`,
        }}
      >
        {options.map((option) => (
          <label key={option.value} className={cx("radio-label")}>
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={() => handleSelect(option.value)}
              className={cx("radio-input")}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default GroupRadio;
