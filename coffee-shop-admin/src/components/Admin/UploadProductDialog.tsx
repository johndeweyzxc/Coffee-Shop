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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { Product } from "../../model/useProductsModel";
import { AddOn } from "../../model/useAddOnsModel";
import { InputHelperTextUpload } from "../../controller/useProduct/useUploadProduct";

interface AddOnListProps {
  addOns: AddOn[];
  onRemoveAddOn: (name: string) => void;
}
function AddOnList(props: AddOnListProps) {
  return (
    <>
      {props.addOns.map((addOn, index) => {
        return (
          <Box sx={{ display: "flex", marginTop: ".5rem" }} key={index}>
            <TextField
              name="Name"
              label="Name"
              variant="standard"
              value={addOn.Name}
              sx={{ marginRight: ".5rem" }}
              fullWidth
            />
            <TextField
              name="Price"
              label="Price"
              variant="standard"
              value={addOn.Price}
              sx={{ marginRight: ".5rem" }}
              fullWidth
            />
            <Tooltip title="Remove addon">
              <IconButton onClick={() => props.onRemoveAddOn(addOn.Name)}>
                <HighlightOffIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </>
  );
}

interface UploadProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newProduct: Product;
  onChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onUploadProduct: () => void;
  inputHelperText: InputHelperTextUpload;
  addOnListNewProduct: AddOn[];
  currAddOn: AddOn;
  onChangeAddOn: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddAddOns: () => void;
  onRemoveAddOn: (name: string) => void;
  onSetProductImage: (file: File) => void;
}

export default function UploadProductDialog(props: UploadProductDialogProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          props.onUploadProduct();
        },
      }}
    >
      <DialogTitle>Create new product</DialogTitle>
      <DialogContent>
        <TextField
          error={props.inputHelperText.IsErrName}
          helperText={props.inputHelperText.NameText}
          name="Name"
          label="Name"
          variant="standard"
          value={props.newProduct.Name}
          sx={{ marginBottom: "1rem" }}
          fullWidth
          onChange={props.onChangeInput}
        />
        <TextField
          error={props.inputHelperText.IsErrDescription}
          helperText={props.inputHelperText.DescriptionText}
          name="Description"
          label="Description"
          variant="standard"
          value={props.newProduct.Description}
          sx={{ marginBottom: "1rem" }}
          fullWidth
          onChange={props.onChangeInput}
        />
        <TextField
          error={props.inputHelperText.IsErrPrice}
          helperText={props.inputHelperText.PriceText}
          name="Price"
          label="Price"
          variant="standard"
          type="number"
          value={props.newProduct.Price}
          sx={{ marginBottom: "1rem" }}
          fullWidth
          onChange={props.onChangeInput}
        />
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Upload image
        </Typography>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files !== null) {
              const file = e.target.files[0];
              props.onSetProductImage(file);
            }
          }}
          className="mb-4"
        />
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Add ons
        </Typography>
        <AddOnList
          addOns={props.addOnListNewProduct}
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
        <Button type="submit" color="success">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
