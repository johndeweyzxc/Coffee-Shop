import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { ChangeEvent } from "react";
import { UProduct } from "../../model/api/products";
import { UAddOn } from "../../model/api/addons";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface AddOnListProps {
  uAddOns: UAddOn[];
  onAddAddon: (addOnId: string) => void;
}

function AddOnList(props: AddOnListProps) {
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
              fullWidth
            />
            <TextField
              name="Price"
              label="Price"
              variant="standard"
              value={uAddOn.Price}
              sx={{ marginRight: ".5rem" }}
              fullWidth
            />
            <Tooltip title="Add">
              <IconButton onClick={() => props.onAddAddon(uAddOn.id)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </>
  );
}

interface SelectedAddOnListProps {
  uAddOns: UAddOn[];
  onRemoveAddOn: (addOnId: string) => void;
}

function SelectedAddOnList(props: SelectedAddOnListProps) {
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
              fullWidth
            />
            <TextField
              name="Price"
              label="Price"
              variant="standard"
              value={uAddOn.Price}
              sx={{ marginRight: ".5rem" }}
              fullWidth
            />
            <Tooltip title="Remove">
              <IconButton onClick={() => props.onRemoveAddOn(uAddOn.id)}>
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </>
  );
}

interface SetQuantityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  uProduct: UProduct;
  selectedProdAddOns: UAddOn[];
  currentAddOns: UAddOn[];
  onAddAddon: (addOnId: string) => void;
  onRemoveAddon: (addOnId: string) => void;
  quantity: number;
  totalPrice: number;
  onChangeQuantity: (e: ChangeEvent<HTMLInputElement>) => void;
  onQuantitySet: () => void;
}
export default function SetQuantityDialog(props: SetQuantityDialogProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onQuantitySet();
        },
      }}
    >
      <DialogTitle>Set quantity</DialogTitle>
      <DialogContent dividers>
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
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Add ons
        </Typography>
        <SelectedAddOnList
          uAddOns={props.currentAddOns}
          onRemoveAddOn={props.onRemoveAddon}
        />
        <Typography
          variant="h6"
          sx={{ marginBottom: ".5rem", marginTop: "1rem" }}
        >
          Available Add ons
        </Typography>
        <AddOnList
          uAddOns={props.selectedProdAddOns}
          onAddAddon={props.onAddAddon}
        />
      </DialogContent>
      <Typography variant="body1" sx={{ fontWeight: "normal", margin: "1rem" }}>
        Total Price: ₱{props.totalPrice}
      </Typography>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Cancel
        </Button>
        <Button type="submit" color="success">
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}
