import React, { useState, useEffect } from "react";
import styles from "./SearchWithMenu.module.scss"; // Tạo file SCSS mới cho component này
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import classNames from "classnames/bind";
import { AddCircleOutline } from "@mui/icons-material";
import Button from "../Button/Button";
import { Divider } from "@mui/material";

interface Option {
  value: string | number | undefined;
  label: string | undefined;
}

interface SearchWithMenuProps {
  title?: string;
  options: Option[];
  handleSearch: (query: string) => void;
  handleButtonClick: () => void;
  titleButton?: string;
  onSelect: (value: any) => void;
  widthMenu?: string;
}

const cx = classNames.bind(styles);

const SearchWithMenu: React.FC<SearchWithMenuProps> = ({
  widthMenu,
  onSelect,
  title,
  titleButton = "Thêm",
  options,
  handleSearch,
  handleButtonClick,
}) => {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(query);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query, handleSearch]);

  const handleSelect = (option: Option) => {
    console.log("Selected option:", option); // Xử lý lựa chọn
    onSelect(option.value);
    setQuery(option.label || "");
    setIsOpen(false);
  };

  return (
    <div className={cx("search-with-menu")}>
      {title && <span className={cx("title")}>{title}</span>}
      <div className={cx("search-container")}>
        <span className={cx("search-icon")}>
          <SearchOutlinedIcon />
        </span>
        <input
          className={cx("search-input")}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm..."
          onClick={() => setIsOpen((prev) => !prev)}
          // onBlur={() => setIsOpen(false)}
        />
      </div>
      {isOpen && (
        <div
          className={cx("options-list")}
          style={{ width: widthMenu ? widthMenu : "100%" }}
        >
          <div className={cx("option-list-box")}>
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.value}
                  className={cx("option")}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className={cx("no-options")}>Không có tùy chọn nào</div>
            )}
          </div>
          {/* <button className={cx("action-button")} onClick={() => console.log("Button clicked!")}>
            Thực hiện
          </button> */}
            <Divider />
          <div className={cx("button-box")}>
            <Button
              className={cx("action-button")}
              icon={<AddCircleOutline />}
              content={titleButton}
              onMouseDown={handleButtonClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWithMenu;
