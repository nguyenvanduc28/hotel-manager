import React, { useState, useEffect } from "react";
import style from "./Search.module.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import classNames from "classnames/bind";
interface SearchProps {
  placeholder: string;
  handleSearch: (query: string) => void;
}

const cx = classNames.bind(style);
const Search: React.FC<SearchProps> = ({ placeholder, handleSearch }) => {
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(query);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className={cx("search")}>
      <span className={cx("search-icon")}><SearchOutlinedIcon /></span>
      <input
        className={cx("search-input")}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Search;
