import { ChangeEvent } from "react";
import { LoginInfo } from "../../model/useAppAuthModel";
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
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GoogleIcon from "@mui/icons-material/Google";
import { InputHelperText } from "../../controller/special/useAuthController";

interface RegisterDialogProps {
  isOpenUserRegister: boolean;
  registerUser: LoginInfo;
  onOpenLogin: () => void;
  onChangeRegister: (e: ChangeEvent<HTMLInputElement>) => void;
  onCloseRegistration: () => void;
  onSignInWithGoogle: () => void;
  onRegisterUsingEmailAndPassword: () => void;
  inputHelperText: InputHelperText;
}
export default function RegisterDialog(props: RegisterDialogProps) {
  return (
    <Dialog
      open={props.isOpenUserRegister}
      onClose={props.onCloseRegistration}
      sx={{ backdropFilter: "blur(5px)" }}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onRegisterUsingEmailAndPassword();
        },
      }}
    >
      <DialogTitle>Registration</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          Register using email and password
        </Typography>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          value={props.registerUser.Email}
          label="Email"
          name="Email"
          variant="standard"
          type="email"
          sx={{ marginBottom: ".5rem" }}
          onChange={props.onChangeRegister}
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
          value={props.registerUser.Password}
          label="Password"
          name="Password"
          variant="standard"
          type="password"
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeRegister}
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
              props.onCloseRegistration();
              props.onOpenLogin();
            }}
          >
            Login instead
          </Link>
        </Box>
        <Button
          startIcon={<PersonAddIcon />}
          variant="contained"
          sx={{ marginBottom: "1rem", textTransform: "none" }}
          onClick={props.onRegisterUsingEmailAndPassword}
          fullWidth
        >
          Register
        </Button>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ marginBottom: "1rem", textTransform: "none" }}
          onClick={() => {
            props.onCloseRegistration();
            props.onSignInWithGoogle();
          }}
          fullWidth
        >
          Sign in with Google
        </Button>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onCloseRegistration}
          sx={{ textTransform: "none" }}
          color="info"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
