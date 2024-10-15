import { Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  return (
    <div>
      <h1>Login page</h1>
      <Button
        variant="contained"
        onClick={() => {
          login("test", "test");
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default LoginPage;
