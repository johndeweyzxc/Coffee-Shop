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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { UCart } from "../../model/useCartsModel";
import { UAddOn } from "../../model/useAddOnsModel";
import { truncateName } from "../../utils/stringUtils";

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
  onChangeQuantity: (isIncrement: boolean) => void;
  onEditCart: (dialogImproperlyClosed: boolean) => [number, number];
  selectedCartAddOns: UAddOn[];
  onRemoveAddOnFromSelectedCart: (uAddOn: UAddOn) => void;
  availableAddOns: UAddOn[];
  onRemoveAddOnFromAvaialableAddOns: (uAddOn: UAddOn) => void;
  onOpenDelete: (selectedCart: UCart) => void;
  onCloseDelete: () => void;
  onOpenCheckOut: (uCart: UCart) => void;
  onCloseCheckOut: () => void;
}
export default function EditCartDialog(props: EditCartDialogProps) {
  const RenderSelectedAddOns = () => {
    if (props.selectedCartAddOns.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          No selected add ons
        </Typography>
      );
    } else {
      return (
        <SelectedAddOns
          uAddOns={props.selectedCartAddOns}
          onRemoveAddOnFromSelectedCart={props.onRemoveAddOnFromSelectedCart}
        />
      );
    }
  };

  const RenderAvailableAddOns = () => {
    if (
      props.availableAddOns.length === 0 &&
      props.selectedCartAddOns.length !== 0
    ) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          All add ons have already been selected
        </Typography>
      );
    }

    if (props.availableAddOns.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem", width: 400 }}>
          No available add ons for this product
        </Typography>
      );
    } else {
      return (
        <AvailableAddOns
          uAddOns={props.availableAddOns}
          onRemoveAddOnFromAvaialableAddOns={
            props.onRemoveAddOnFromAvaialableAddOns
          }
        />
      );
    }
  };

  return (
    <Dialog open={props.isOpen} onClose={() => props.onEditCart(true)}>
      <DialogTitle>{truncateName(props.selectedCart.Name)}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product description
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
          {props.selectedCart.Description}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product price
        </Typography>
        <TextField
          name="Price"
          label="Price in Peso (PHP)"
          variant="standard"
          value={props.selectedCart.Price}
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
          sx={{ marginBottom: "1rem" }}
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
          Selected Add ons
        </Typography>
        <RenderSelectedAddOns />
        <Typography
          variant="h6"
          sx={{ marginTop: "1rem", marginBottom: ".5rem" }}
        >
          Available Add ons
        </Typography>
        <RenderAvailableAddOns />
        <Button
          color="info"
          variant="contained"
          sx={{
            marginTop: "1rem",
            marginBottom: ".5rem",
            textTransform: "none",
          }}
          fullWidth
          onClick={() => props.onEditCart(false)}
        >
          Update cart
        </Button>
        <Button
          color="error"
          variant="contained"
          sx={{ textTransform: "none" }}
          fullWidth
          onClick={() => {
            props.onClose();
            props.onOpenDelete(props.selectedCart);
          }}
        >
          Delete cart
        </Button>
      </DialogContent>
      <Typography variant="body2" sx={{ fontWeight: "normal", margin: "1rem" }}>
        Total Price: ${props.totalPrice}
      </Typography>
      <DialogActions>
        <Button
          onClick={() => props.onEditCart(true)}
          sx={{ textTransform: "none" }}
          color="info"
        >
          Cancel
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          color="success"
          onClick={() => {
            const [quantity, totalPrice] = props.onEditCart(true);
            props.selectedCart.TotalPrice = totalPrice;
            props.selectedCart.Quantity = quantity;
            props.onOpenCheckOut(props.selectedCart);
          }}
        >
          Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
}
