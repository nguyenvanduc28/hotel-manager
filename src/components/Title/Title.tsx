import { FC } from "react";
import styles from "./Title.module.scss";
import classNames from "classnames/bind";

interface TitleProps {
  title: string | undefined;
}

const cx = classNames.bind(styles);

const Title: FC<TitleProps> = ({ title }) => {
  return (
    <div className={cx("title-wrapper")}>
      <span className={cx("title")}>{title}</span>
    </div>
  );
};

export default Title;
