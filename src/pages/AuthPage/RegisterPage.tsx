import React, { useState } from "react";
import { Button, TextField, Typography, Snackbar } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import styles from "./RegisterPage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const RegisterPage = () => {
  const { registerForAdmin } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleRegister = async () => {
    // Validation
    if (!username || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      setOpenSnackbar(true);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setOpenSnackbar(true);
      return;
    }


    try {
      await registerForAdmin(username, password, [{id: 1, name: "ADMIN"}]);
    } catch (err) {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", fontSize: "16px" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Đăng Ký Tài Khoản Admin
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

      <TextField
        className={cx('inputField')}
        label="Xác nhận mật khẩu"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleRegister}
        style={{ fontSize: "1.4rem", marginTop: "20px" }}
      >
        Đăng Ký
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </div>
  );
};

export default RegisterPage; 