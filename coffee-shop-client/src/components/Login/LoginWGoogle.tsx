import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface LoginWGoogleProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginWithGoogle: () => void;
}
export default function LoginWGoogle(props: LoginWGoogleProps) {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Login with Google</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          You need to sign in using your Google account in order for this to
          work
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="error">
          Cancel
        </Button>
        <Button onClick={props.onLoginWithGoogle}>Login</Button>
      </DialogActions>
    </Dialog>
  );
}
