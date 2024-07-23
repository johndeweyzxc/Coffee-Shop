import React, { ChangeEvent } from "react";
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

import { ShippingAddress } from "../../model/useOrderModel";
import { UCart } from "../../model/useCartsModel";
import { UAddOn } from "../../model/useAddOnsModel";

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
  shipInfoErrText: string;
}
export default function CheckoutDialog(props: CheckoutDialogProps) {
  const RenderSelectedAddOns = () => {
    if (props.checkoutAddOns.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          No selected add ons
        </Typography>
      );
    } else {
      return <SelectedAddOns uAddOns={props.checkoutAddOns} />;
    }
  };

  const RenderInfoErrorText = () => {
    if (props.shipInfoErrText.length !== 0) {
      return (
        <Typography
          variant="subtitle2"
          color="red"
          sx={{ marginBottom: ".5rem" }}
        >
          *{props.shipInfoErrText}
        </Typography>
      );
    } else {
      return null;
    }
  };

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
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product Information
        </Typography>
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
        <RenderSelectedAddOns />
        <Typography
          variant="h6"
          sx={{ marginBottom: ".5rem", marginTop: "1rem" }}
        >
          Shipping Information
        </Typography>
        <RenderInfoErrorText />
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
            fullWidth
          />
          <TextField
            name="City"
            label="City"
            variant="standard"
            value={props.shipAddress.City}
            onChange={props.onChangeShipAddress}
            fullWidth
          />
        </Box>
        <TextField
          name="District"
          label="District"
          variant="standard"
          value={props.shipAddress.District}
          sx={{ marginBottom: ".5rem" }}
          onChange={props.onChangeShipAddress}
          fullWidth
        />
        <TextField
          name="Street"
          label="Street"
          variant="standard"
          value={props.shipAddress.Street}
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeShipAddress}
          fullWidth
        />
      </DialogContent>
      <Typography variant="body2" sx={{ fontWeight: "normal", margin: "1rem" }}>
        <b>Total Price: </b>₱{props.selectedCart.TotalPrice}
      </Typography>
      <DialogActions>
        <Button
          onClick={props.onClose}
          sx={{ textTransform: "none" }}
          color="info"
        >
          Cancel
        </Button>
        <Button type="submit" sx={{ textTransform: "none" }} color="success">
          Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
