import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { UCart } from "../../model/useCartsModel";

interface DeleteCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCart: UCart;
  onRemoveFromCart: () => void;
}
export default function DeleteCartDialog(props: DeleteCartDialogProps) {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Remove from cart</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to remove {props.selectedCart.Name} from cart?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          sx={{ textTransform: "none" }}
          color="info"
        >
          Cancel
        </Button>
        <Button
          onClick={props.onRemoveFromCart}
          sx={{ textTransform: "none" }}
          color="error"
        >
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}
