import React, { useState, useEffect } from "react";
import style from "./Search.module.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import classNames from "classnames/bind";
interface SearchProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

const cx = classNames.bind(style);
const Search: React.FC<SearchProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

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
