import { ButtonBase, ButtonBaseProps } from "@mui/material";
import { ReactNode } from "react";

type ButtonProps = ButtonBaseProps & {
  icon?: ReactNode;
  content: string;
};

const Button: React.FC<ButtonProps> = ({
  icon,
  content,
  disabled,
  ...props
}) => {
  return (
    <ButtonBase
      sx={{
        background: "linear-gradient(180deg, #4697fe, #08f)",
        borderColor: "#08f",
        boxShadow: "inset 0 1px 0 0 #549cf9",
        color: "#fff",
        padding: "8px 16px 8px 8px",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        height: "36px",
        fontSize: "1.4rem",
        justifyContent: "center",
        cursor: "pointer",
        "&:hover": {
          background: "linear-gradient(180deg, #3893fe, #07e)",
          boxShadow: "inset 0 2px 0 0 #479bf9",
        },
        "&.Mui-disabled": {
          background: "#ccc",
          boxShadow: "none",
          cursor: "not-allowed",
        },
        "& span": {
          display: "inline-flex",
          alignItems: "center",
          marginRight: icon ? "8px" : "0",
        },
        "& svg": {
          fontSize: "1.8rem",
          // marginRight: "8px",
        },
      }}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {content}
    </ButtonBase>
  );
};

export default Button;
