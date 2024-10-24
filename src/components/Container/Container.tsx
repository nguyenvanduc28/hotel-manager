import { ReactNode } from "react";
import styles from "./Container.module.scss";
import classNames from "classnames/bind";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { Link } from "react-router-dom";
type ContainerProps = {
  children: ReactNode;
  fullscreen?: boolean;
  title: string;
  button?: ReactNode;
  linkToBack?: string;
  titleToBack?: string;
};

const cx = classNames.bind(styles);
const Container: React.FC<ContainerProps> = ({
  children,
  fullscreen = false,
  title,
  button,
  linkToBack,
  titleToBack,
}) => {
  return (
    <div className={cx("container-wrapper")}>
      <div className={cx("container-box", { fullscreen: fullscreen })}>
        <div className={cx("container-header")}>
          <div className={cx("container-header-title")}>
            {linkToBack && (
              <Link to={linkToBack}>
                <p className={cx("title-back")}>
                  <KeyboardArrowLeftOutlinedIcon />
                  {titleToBack}
                </p>
              </Link>
            )}
            <p className={cx("title")}>{title}</p>
          </div>
          <div className={cx("container-header-button")}>{button}</div>
        </div>
        <div className={cx("container-content")}>{children}</div>
        <div className={cx("b")}></div>
      </div>
    </div>
  );
};

export default Container;
