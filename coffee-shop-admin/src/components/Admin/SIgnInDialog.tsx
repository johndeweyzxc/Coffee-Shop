import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export interface AskToSignInDialogParams {
  isLoggedIn: boolean;
  onClose: () => void;
}
export default function AskToSignInDialog(props: AskToSignInDialogParams) {
  return (
    <Dialog open={props.isLoggedIn} onClose={props.onClose}>
      <DialogTitle>Authentication</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To access the admin panel, please login with your google account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => (window.location.href = "/")}>Cancel</Button>
        <Button
          onClick={() => {
            // TODO: Implementation
          }}
        >
          Login with Google
        </Button>
      </DialogActions>
    </Dialog>
  );
}
