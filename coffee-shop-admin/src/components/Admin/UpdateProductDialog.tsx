import { ChangeEvent } from "react";
import { UProduct } from "../../model/api/products";
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
import { AddOn, UAddOn } from "../../model/api/addOns";

interface AddOnListProps {
  addOns: UAddOn[];
  onRemoveAddOn: (name: string, addOnId: string) => void;
}
function AddOnList(props: AddOnListProps) {
  if (props.addOns === undefined) {
    return <></>;
  }

  return (
    <>
      {props.addOns.map((uAddOn, index) => {
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
            <Tooltip title="Remove addon">
              <IconButton
                onClick={() => props.onRemoveAddOn(uAddOn.Name, uAddOn.id)}
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

interface UpdateProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  uProduct: UProduct;
  onChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
  onDelete: () => void;
  addOnListUProduct: UAddOn[];
  currAddOn: AddOn;
  onChangeAddOn: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddAddOns: () => void;
  onRemoveAddOn: (name: string, addOnId: string) => void;
}

export default function UpdateProductDialog(props: UpdateProductDialogProps) {
  // TODO: Add helper text for input errors

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onUpdate();
        },
      }}
    >
      <DialogTitle>Create New Product</DialogTitle>
      <DialogContent>
        <TextField
          name="Name"
          label="Name"
          variant="standard"
          value={props.uProduct.Name}
          fullWidth
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeInput}
        />
        <TextField
          name="Description"
          label="Description"
          variant="standard"
          value={props.uProduct.Description}
          fullWidth
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeInput}
        />
        <TextField
          name="Price"
          label="Price"
          variant="standard"
          value={props.uProduct.Price}
          fullWidth
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeInput}
        />

        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Add ons
        </Typography>
        <AddOnList
          addOns={props.addOnListUProduct}
          onRemoveAddOn={props.onRemoveAddOn}
        />
        <Typography
          variant="h6"
          sx={{ marginTop: "1rem", marginBottom: ".5rem" }}
        >
          Create add on
        </Typography>
        <Box sx={{ display: "flex" }}>
          <TextField
            name="Name"
            label="Name"
            variant="standard"
            value={props.currAddOn.Name}
            sx={{ marginRight: ".5rem" }}
            fullWidth
            onChange={props.onChangeAddOn}
          />
          <TextField
            name="Price"
            label="Price"
            variant="standard"
            type="number"
            value={props.currAddOn.Price}
            sx={{ marginRight: ".5rem" }}
            fullWidth
            onChange={props.onChangeAddOn}
          />
          <Tooltip title="Add addon">
            <IconButton onClick={props.onAddAddOns}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="info">
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onDelete();
            props.onClose();
          }}
          color="error"
        >
          Delete
        </Button>
        <Button type="submit" color="success">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
