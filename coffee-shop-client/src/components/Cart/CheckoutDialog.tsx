import React, { ChangeEvent } from "react";
import { UCart } from "../../model/api/cart";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { ShippingAddress } from "../../model/api/order";
import { UAddOn } from "../../model/api/addons";

interface SelectedAddOnsProps {
  uAddOns: UAddOn[];
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
          </Box>
        );
      })}
    </>
  );
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCart: UCart;
  clientName: string;
  onChangeClientName: (e: ChangeEvent<HTMLInputElement>) => void;
  shipAddress: ShippingAddress;
  onChangeShipAddress: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheckout: () => void;
  checkoutAddOns: UAddOn[];
}
export default function CheckoutDialog(props: CheckoutDialogProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onCheckout();
        },
      }}
    >
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent dividers>
        <TextField
          value={props.selectedCart.Name}
          sx={{ marginBottom: ".5rem" }}
          label="Name"
          variant="standard"
          fullWidth
        />
        <Box sx={{ display: "flex", marginBottom: "1rem" }}>
          <TextField
            value={props.selectedCart.Quantity}
            sx={{ marginRight: ".5rem" }}
            label="Quantity"
            variant="standard"
            fullWidth
          />
          <TextField
            value={props.selectedCart.Price}
            label="Price"
            variant="standard"
            fullWidth
          />
        </Box>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Add ons
        </Typography>
        <SelectedAddOns uAddOns={props.checkoutAddOns} />
        <Typography
          variant="h6"
          sx={{ marginBottom: ".5rem", marginTop: "1rem" }}
        >
          Shipping Information
        </Typography>
        <TextField
          name="ClientName"
          label="Client name"
          variant="standard"
          value={props.clientName}
          sx={{ marginBottom: ".5rem" }}
          onChange={props.onChangeClientName}
          fullWidth
        />
        <Box sx={{ display: "flex", marginBottom: ".5rem" }}>
          <TextField
            name="Region"
            label="Region"
            variant="standard"
            value={props.shipAddress.Region}
            sx={{ marginRight: ".5rem" }}
            onChange={props.onChangeShipAddress}
          />
          <TextField
            name="City"
            label="City"
            variant="standard"
            value={props.shipAddress.City}
            onChange={props.onChangeShipAddress}
          />
        </Box>
        <Box sx={{ marginBottom: ".5rem" }}>
          <TextField
            name="District"
            label="District"
            variant="standard"
            value={props.shipAddress.District}
            sx={{ marginRight: ".5rem" }}
            onChange={props.onChangeShipAddress}
          />
          <TextField
            name="Street"
            label="Street"
            variant="standard"
            value={props.shipAddress.Street}
            onChange={props.onChangeShipAddress}
          />
        </Box>
      </DialogContent>
      <Typography variant="body2" sx={{ fontWeight: "normal", margin: "1rem" }}>
        <b>Total Price: </b>${props.selectedCart.TotalPrice}
      </Typography>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Cancel
        </Button>
        <Button type="submit" color="success">
          Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
