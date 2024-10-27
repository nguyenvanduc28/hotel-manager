import React, { useState } from "react";
import { Button, TextField, Typography, Snackbar } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px"}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Trang Đăng Nhập
      </Typography>
      <TextField
        label="Tên đăng nhập"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{fontSize: "1.6rem" }}
      />
      <TextField
        label="Mật khẩu"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{fontSize: "1.6rem" }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
      >
        Đăng Nhập
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

export default LoginPage;
