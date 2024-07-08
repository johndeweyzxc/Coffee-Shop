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
import { styled } from "@mui/material/styles";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ImageIcon from "@mui/icons-material/Image";

import { Product } from "../../model/useProductsModel";
import { AddOn } from "../../model/useAddOnsModel";
import { InputHelperTextUpload } from "../../controller/useProduct/useUploadProduct";
import DefaultProductImage from "../../assets/images/default-product-image.png";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
  productImage: File | null;
}

export default function UploadProductDialog(props: UploadProductDialogProps) {
  const RenderAddOns = () => {
    if (props.addOnListNewProduct.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem" }}>
          No addons created
        </Typography>
      );
    } else {
      return (
        <AddOnList
          addOns={props.addOnListNewProduct}
          onRemoveAddOn={props.onRemoveAddOn}
        />
      );
    }
  };

  const RenderSelectedProductImage = () => {
    if (props.productImage === null) {
      return (
        <>
          <Typography variant="subtitle2" sx={{ maginBottom: ".25rem" }}>
            Default product image
          </Typography>
          <img
            src={DefaultProductImage}
            alt="Default coffee product"
            width="350"
          />
        </>
      );
    } else {
      return (
        <img
          src={URL.createObjectURL(props.productImage)}
          alt={props.newProduct.Name}
          width="350"
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
        <RenderSelectedProductImage />
        <Button
          component="label"
          role={undefined}
          variant="outlined"
          startIcon={<ImageIcon />}
          sx={{
            marginTop: ".5rem",
            marginBottom: "1rem",
          }}
          fullWidth
        >
          Upload image
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => {
              if (e.target.files !== null) {
                const file = e.target.files[0];
                props.onSetProductImage(file);
              }
            }}
            className="mb-4"
          />
        </Button>
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Add ons
        </Typography>
        <RenderAddOns />
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
        <Button
          onClick={props.onClose}
          color="info"
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>
        <Button type="submit" color="success" sx={{ textTransform: "none" }}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
