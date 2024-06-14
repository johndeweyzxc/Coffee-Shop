import { ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { UCart } from "../../model/api/cart";

interface EditCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCart: UCart;
  quantity: number;
  totalPrice: number;
  onChangeQuantity: (e: ChangeEvent<HTMLInputElement>) => void;
  onEditCart: () => void;
}
export default function EditCartDialog(props: EditCartDialogProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onEditCart();
        },
      }}
    >
      <DialogTitle>Edit quantity</DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ marginBottom: "1rem" }}>
          Edit quantity for {props.selectedCart.Name}
        </DialogContentText>
        <TextField
          name="Quantity"
          label="Quantity"
          variant="standard"
          type="number"
          value={props.quantity}
          sx={{ marginBottom: "1rem" }}
          fullWidth
          onChange={props.onChangeQuantity}
        />
      </DialogContent>
      <Typography variant="body2" sx={{ fontWeight: "normal", margin: "1rem" }}>
        Total Price: ${props.totalPrice}
      </Typography>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Cancel
        </Button>
        <Button type="submit" color="success">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
