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

import { UAddOn } from "../../model/useAddOnsModel";
import { UOrder } from "../../model/useOrderModel";

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

interface ViewOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: UOrder;
  currAddOns: UAddOn[];
}
export default function ViewOrderDialog(props: ViewOrderDialogProps) {
  const RenderSelectedAddOns = () => {
    if (props.currAddOns.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          No selected add ons
        </Typography>
      );
    } else {
      return <SelectedAddOns uAddOns={props.currAddOns} />;
    }
  };

  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Order Information</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product information
        </Typography>
        <TextField
          value={props.selectedOrder.ProductOrderInfo.Name}
          sx={{ marginBottom: ".5rem" }}
          label="Name"
          variant="standard"
          fullWidth
        />
        <Box sx={{ display: "flex", marginBottom: "1rem" }}>
          <TextField
            value={props.selectedOrder.ProductOrderInfo.Quantity}
            sx={{ marginRight: ".5rem" }}
            label="Quantity"
            variant="standard"
            fullWidth
          />
          <TextField
            value={props.selectedOrder.ProductOrderInfo.Price}
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
        <TextField
          label="Client name"
          variant="standard"
          value={props.selectedOrder.ClientName}
          sx={{ marginBottom: ".5rem" }}
          fullWidth
        />
        <Box sx={{ display: "flex", marginBottom: ".5rem" }}>
          <TextField
            label="Region"
            variant="standard"
            value={props.selectedOrder.ShippingAddressLocation.Region}
            sx={{ marginRight: ".5rem" }}
            fullWidth
          />
          <TextField
            name="City"
            label="City"
            variant="standard"
            value={props.selectedOrder.ShippingAddressLocation.City}
            fullWidth
          />
        </Box>
        <Box sx={{ marginBottom: "1rem" }}>
          <TextField
            name="District"
            label="District"
            variant="standard"
            value={props.selectedOrder.ShippingAddressLocation.District}
            sx={{ marginRight: ".5rem", marginBottom: ".5rem" }}
            fullWidth
          />
          <TextField
            name="Street"
            label="Street"
            variant="standard"
            value={props.selectedOrder.ShippingAddressLocation.Street}
            fullWidth
          />
        </Box>
        <Typography
          variant="h6"
          sx={{ marginBottom: ".5rem", marginTop: "1rem" }}
        >
          Status
        </Typography>
        <TextField
          name="Status"
          variant="standard"
          value={props.selectedOrder.Status}
          fullWidth
        />
      </DialogContent>
      <Typography variant="body2" sx={{ fontWeight: "normal", margin: "1rem" }}>
        <b>Total Price: </b>${props.selectedOrder.ProductOrderInfo.TotalPrice}
      </Typography>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
