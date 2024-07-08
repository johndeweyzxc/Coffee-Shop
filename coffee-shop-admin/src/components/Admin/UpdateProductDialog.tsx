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
import { styled } from "@mui/material/styles";
import ImageIcon from "@mui/icons-material/Image";

import { AddOn, UAddOn } from "../../model/useAddOnsModel";
import { UProduct } from "../../model/useProductsModel";
import { InputHelperTextUpdate } from "../../controller/useProduct/useUpdateProduct";
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
  addOns: UAddOn[];
  onRemoveAddOn: (addOnId: string) => void;
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
              <IconButton onClick={() => props.onRemoveAddOn(uAddOn.id)}>
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
  onRemoveAddOn: (addOnId: string) => void;
  onSetUProductImage: (file: File) => void;
  productImage: File | null;
  inputHelperText: InputHelperTextUpdate;
}

export default function UpdateProductDialog(props: UpdateProductDialogProps) {
  const RenderAddOns = () => {
    if (props.addOnListUProduct.length === 0) {
      return (
        <Typography variant="subtitle2" sx={{ maginTop: ".5rem" }}>
          No addons is found for this product
        </Typography>
      );
    } else {
      return (
        <AddOnList
          addOns={props.addOnListUProduct}
          onRemoveAddOn={props.onRemoveAddOn}
        />
      );
    }
  };

  const RenderImage = () => {
    if (props.productImage !== null) {
      return (
        <img
          src={URL.createObjectURL(props.productImage)}
          alt={props.uProduct.Name}
          width="350"
          className="self-center my-2"
        />
      );
    }

    if (props.uProduct.ProductImageURL === "") {
      return (
        <>
          <Typography
            variant="subtitle2"
            sx={{ marginTop: ".5rem", marginBottom: ".5rem" }}
          >
            No image is found for this product, showing default image instead
          </Typography>
          <img
            src={DefaultProductImage}
            alt="Default coffee product image"
            width="350"
          />
        </>
      );
    } else {
      return (
        <img
          src={props.uProduct.ProductImageURL}
          alt={props.uProduct.Name}
          width="350"
          className="self-center my-2"
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
          props.onUpdate();
        },
      }}
    >
      <DialogTitle>Update product</DialogTitle>
      <DialogContent>
        <TextField
          error={props.inputHelperText.IsErrName}
          helperText={props.inputHelperText.NameText}
          name="Name"
          label="Name"
          variant="standard"
          value={props.uProduct.Name}
          fullWidth
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeInput}
        />
        <TextField
          error={props.inputHelperText.IsErrDescription}
          helperText={props.inputHelperText.DescriptionText}
          name="Description"
          label="Description"
          variant="standard"
          value={props.uProduct.Description}
          fullWidth
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeInput}
        />
        <TextField
          error={props.inputHelperText.IsErrPrice}
          helperText={props.inputHelperText.PriceText}
          name="Price"
          label="Price"
          variant="standard"
          type="number"
          value={props.uProduct.Price}
          fullWidth
          sx={{ marginBottom: "1rem" }}
          onChange={props.onChangeInput}
        />
        <Typography variant="h6" sx={{ marginBottom: ".5rem" }}>
          Product image
        </Typography>
        <RenderImage />
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
                props.onSetUProductImage(file);
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
        <Button
          sx={{ textTransform: "none" }}
          onClick={() => {
            props.onDelete();
            props.onClose();
          }}
          color="error"
        >
          Delete
        </Button>
        <Button type="submit" color="success" sx={{ textTransform: "none" }}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
