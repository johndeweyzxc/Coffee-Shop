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
import { UOrder } from "../../model/useOrdersModel";
import { ChangeEvent } from "react";

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

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: UOrder;
  currAddOns: UAddOn[];
  onDeleteOrder: () => void;
  onChangeStatus: (e: ChangeEvent<HTMLInputElement>) => void;
  currentStatus: string;
  onUpdateStatus: () => void;
  isStatusValid: boolean;
}
export default function OrderDialog(props: OrderDialogProps) {
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Order Information</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product information
        </Typography>
        <TextField
          value={props.selectedOrder.Name}
          sx={{ marginBottom: ".5rem" }}
          label="Name"
          variant="standard"
          fullWidth
        />
        <Box sx={{ display: "flex", marginBottom: "1rem" }}>
          <TextField
            value={props.selectedOrder.Quantity}
            sx={{ marginRight: ".5rem" }}
            label="Quantity"
            variant="standard"
            fullWidth
          />
          <TextField
            value={props.selectedOrder.Price}
            label="Price"
            variant="standard"
            fullWidth
          />
        </Box>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Add ons
        </Typography>
        <SelectedAddOns uAddOns={props.currAddOns} />
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
            value={props.selectedOrder.Region}
            sx={{ marginRight: ".5rem" }}
            fullWidth
          />
          <TextField
            name="City"
            label="City"
            variant="standard"
            value={props.selectedOrder.City}
            fullWidth
          />
        </Box>
        <Box sx={{ marginBottom: "1rem" }}>
          <TextField
            name="District"
            label="District"
            variant="standard"
            value={props.selectedOrder.District}
            sx={{ marginRight: ".5rem", marginBottom: ".5rem" }}
            fullWidth
          />
          <TextField
            name="Street"
            label="Street"
            variant="standard"
            value={props.selectedOrder.Street}
            fullWidth
          />
        </Box>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Order status
        </Typography>
        <TextField
          error={false}
          helperText={""}
          name="OrderStatus"
          variant="outlined"
          value={props.currentStatus}
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeStatus}
          fullWidth
        />
        <Button
          variant="outlined"
          color="success"
          disabled={!props.isStatusValid}
          onClick={props.onUpdateStatus}
          fullWidth
        >
          Update Status
        </Button>
      </DialogContent>
      <Typography variant="body2" sx={{ fontWeight: "normal", margin: "1rem" }}>
        <b>Total Price: </b>${props.selectedOrder.TotalPrice}
      </Typography>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Cancel
        </Button>
        <Button onClick={props.onDeleteOrder} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
