import { ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { UCart } from "../../model/api/cart";
import { UAddOn } from "../../model/api/addons";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface SelectedAddOnsProps {
  uAddOns: UAddOn[];
  onRemoveAddOnFromSelectedCart: (uAddOn: UAddOn) => void;
}
function SelectedAddOns(props: SelectedAddOnsProps) {
  return (
    <>
      {props.uAddOns.map((uAddOn, index) => {
        return (
          <Box sx={{ display: "flex", marginTop: ".5rem" }} key={index}>
            <TextField
              name="Name"
              label="Name"
              variant="standard"
              value={uAddOn.Name}
              sx={{ marginRight: ".5rem" }}
            />
            <TextField
              name="Price"
              label="Price"
              variant="standard"
              value={uAddOn.Price}
              sx={{ marginRight: ".5rem" }}
            />
            <Tooltip title="Remove addon">
              <IconButton
                onClick={() => props.onRemoveAddOnFromSelectedCart(uAddOn)}
              >
                <HighlightOffIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </>
  );
}

interface AvailableAddOnsProps {
  uAddOns: UAddOn[];
  onRemoveAddOnFromAvaialableAddOns: (uAddOn: UAddOn) => void;
}
function AvailableAddOns(props: AvailableAddOnsProps) {
  return (
    <>
      {props.uAddOns.map((uAddOn, index) => {
        return (
          <Box sx={{ display: "flex", marginTop: ".5rem" }} key={index}>
            <TextField
              name="Name"
              label="Name"
              variant="standard"
              value={uAddOn.Name}
              sx={{ marginRight: ".5rem" }}
            />
            <TextField
              name="Price"
              label="Price"
              variant="standard"
              value={uAddOn.Price}
              sx={{ marginRight: ".5rem" }}
            />
            <Tooltip title="Add addon">
              <IconButton
                onClick={() => props.onRemoveAddOnFromAvaialableAddOns(uAddOn)}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </>
  );
}

interface EditCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCart: UCart;
  quantity: number;
  totalPrice: number;
  onChangeQuantity: (e: ChangeEvent<HTMLInputElement>) => void;
  onEditCart: () => void;
  selectedCartAddOns: UAddOn[];
  onRemoveAddOnFromSelectedCart: (uAddOn: UAddOn) => void;
  availableAddOns: UAddOn[];
  onRemoveAddOnFromAvaialableAddOns: (uAddOn: UAddOn) => void;
}
export default function EditCartDialog(props: EditCartDialogProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onEditCart}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onEditCart();
        },
      }}
    >
      <DialogTitle>{props.selectedCart.Name}</DialogTitle>
      <DialogContent dividers>
        <TextField
          name="Quantity"
          label="Quantity"
          variant="standard"
          type="number"
          value={props.quantity}
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeQuantity}
        />
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Selected Add ons
        </Typography>
        <SelectedAddOns
          uAddOns={props.selectedCartAddOns}
          onRemoveAddOnFromSelectedCart={props.onRemoveAddOnFromSelectedCart}
        />
        <Typography
          variant="h6"
          sx={{ marginTop: "1rem", marginBottom: ".5rem" }}
        >
          Available Add ons
        </Typography>
        <AvailableAddOns
          uAddOns={props.availableAddOns}
          onRemoveAddOnFromAvaialableAddOns={
            props.onRemoveAddOnFromAvaialableAddOns
          }
        />
      </DialogContent>
      <Typography variant="body2" sx={{ fontWeight: "normal", margin: "1rem" }}>
        Total Price: ${props.totalPrice}
      </Typography>
      <DialogActions>
        <Button onClick={props.onEditCart} color="info">
          Cancel
        </Button>
        <Button type="submit" color="success">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
