import React from "react";
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { UProduct } from "../../model/useProductsModel";
import { UAddOn } from "../../model/useAddOnsModel";
import { truncateName } from "../../utils/stringUtils";

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
              label="Price in Peso (PHP)"
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
              label="Price in Peso (PHP)"
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

interface AddCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  uProduct: UProduct;
  selectedProdAddOns: UAddOn[];
  currentAddOns: UAddOn[];
  onAddAddon: (addOnId: string) => void;
  onRemoveAddon: (addOnId: string) => void;
  quantity: number;
  totalPrice: number;
  onChangeQuantity: (isIncrement: boolean) => void;
  onQuantitySet: () => void;
}
export default function AddCartDialog(props: AddCartDialogProps) {
  const RenderSelectedAddOns = () => {
    if (props.currentAddOns.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          No selected add ons
        </Typography>
      );
    } else {
      return (
        <SelectedAddOnList
          uAddOns={props.currentAddOns}
          onRemoveAddOn={props.onRemoveAddon}
        />
      );
    }
  };

  const RenderAvailableAddOns = () => {
    if (
      props.selectedProdAddOns.length === 0 &&
      props.currentAddOns.length !== 0
    ) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          All add ons have already been selected
        </Typography>
      );
    }

    if (props.selectedProdAddOns.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          No available add ons for this product
        </Typography>
      );
    } else {
      return (
        <AddOnList
          uAddOns={props.selectedProdAddOns}
          onAddAddon={props.onAddAddon}
        />
      );
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
          props.onQuantitySet();
        },
      }}
    >
      <DialogTitle>{truncateName(props.uProduct.Name)}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product description
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          {props.uProduct.Description}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product price
        </Typography>
        <TextField
          name="Price"
          label="Price in Peso (PHP)"
          variant="standard"
          value={props.uProduct.Price}
          sx={{ marginBottom: "1rem" }}
          fullWidth
        />
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product quantity
        </Typography>
        <TextField
          name="Quantity"
          label="Set quantity"
          variant="standard"
          type="number"
          value={props.quantity}
          sx={{ marginBottom: ".5rem" }}
          fullWidth
        />
        <Box sx={{ display: "flex", marginBottom: "1rem" }}>
          <Button
            startIcon={<AddIcon />}
            color="success"
            variant="contained"
            sx={{
              width: "100%",
              marginRight: ".5rem",
            }}
            onClick={() => props.onChangeQuantity(true)}
          />
          <Button
            startIcon={<RemoveIcon />}
            color="error"
            variant="contained"
            sx={{ width: "100%", marginLeft: ".5rem" }}
            onClick={() => props.onChangeQuantity(false)}
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
          Available Add ons
        </Typography>
        <RenderAvailableAddOns />
      </DialogContent>
      <Typography
        variant="subtitle2"
        sx={{ marginTop: "1rem", marginLeft: "1.5rem" }}
      >
        Total Price: ₱{props.totalPrice}
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
          Add to cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}
