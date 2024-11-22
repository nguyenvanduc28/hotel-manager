import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import styles from "./LoginPage.module.scss";
import classNames from "classnames/bind";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);
const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (err) {
      // toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };


  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", fontSize:"16px"}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Trang Đăng Nhập
      </Typography>
      <TextField
        className={cx('inputField')}
        label="Tên đăng nhập"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        className={cx('inputField')}
        label="Mật khẩu"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        style={{ fontSize: "1.4rem" }}
      >
        Đăng Nhập
      </Button>
    </div>
  );
};

export default LoginPage;
