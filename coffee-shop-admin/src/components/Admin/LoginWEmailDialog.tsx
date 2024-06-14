import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent } from "react";

interface LoginWEmailProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onLogin: (e: FormEvent<HTMLFormElement>) => void;
}
export default function LoginWEmailDialog(props: LoginWEmailProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        component: "form",
        onSubmit: props.onLogin,
      }}
    >
      <DialogTitle>Login as admin</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          You need to login as admin to access functionalities that are only
          available on admin mode.
        </Typography>
        <TextField
          required
          margin="dense"
          name="Username"
          label="Email"
          type="email"
          fullWidth
          variant="standard"
          onChange={props.onChangeInput}
        />
        <TextField
          required
          margin="dense"
          name="Password"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          onChange={props.onChangeInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="error">
          Cancel
        </Button>
        <Button type="submit">Login</Button>
      </DialogActions>
    </Dialog>
  );
}
