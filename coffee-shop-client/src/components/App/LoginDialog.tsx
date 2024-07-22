import { ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import LoginIcon from "@mui/icons-material/Login";

import { LoginInfo } from "../../model/useAppAuthModel";
import { InputHelperText } from "../../controller/special/useAuthController";

interface LoginDialogProps {
  isOpenUserLogin: boolean;
  onCloseLogin: () => void;
  onOpenRegistration: () => void;
  loginUserInfo: LoginInfo;
  onChangeLogin: (e: ChangeEvent<HTMLInputElement>) => void;
  onSignInWithGoogle: () => void;
  onLogInUsingEmailAndPassword: () => void;
  inputHelperText: InputHelperText;
}
export default function LoginDialog(props: LoginDialogProps) {
  return (
    <Dialog
      open={props.isOpenUserLogin}
      onClose={props.onCloseLogin}
      sx={{ backdropFilter: "blur(5px)" }}
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          {window.location.pathname !== "/"
            ? "You need to login in order for this to work"
            : "Login using your email and password"}
        </Typography>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          value={props.loginUserInfo.Email}
          label="Email"
          name="Email"
          variant="standard"
          type="email"
          sx={{ marginBottom: ".5rem" }}
          onChange={props.onChangeLogin}
          error={props.inputHelperText.IsError}
          helperText={props.inputHelperText.ErrorMessage}
          fullWidth
        />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon />
              </InputAdornment>
            ),
          }}
          value={props.loginUserInfo.Password}
          label="Password"
          name="Password"
          variant="standard"
          type="password"
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeLogin}
          error={props.inputHelperText.IsError}
          helperText={props.inputHelperText.ErrorMessage}
          fullWidth
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Link
            component="button"
            variant="body2"
            sx={{ marginBottom: "1rem", fontWeight: "bold" }}
            onClick={() => {
              props.onCloseLogin();
              props.onOpenRegistration();
            }}
          >
            Register instead
          </Link>
        </Box>
        <Button
          startIcon={<LoginIcon />}
          variant="contained"
          sx={{ marginBottom: "1rem", textTransform: "none" }}
          onClick={props.onLogInUsingEmailAndPassword}
          fullWidth
        >
          Login
        </Button>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ marginBottom: "1rem", textTransform: "none" }}
          onClick={() => {
            props.onCloseLogin();
            props.onSignInWithGoogle();
          }}
          fullWidth
        >
          Login with Google
        </Button>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onCloseLogin}
          sx={{ textTransform: "none" }}
          color="info"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
