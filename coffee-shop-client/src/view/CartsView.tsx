import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import useCartController from "../controller/useCartController";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCartDialog from "../components/Cart/EditCartDialog";
import DeleteCartDialog from "../components/Cart/DeleteCartDialog";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { UCart } from "../model/api/cart";
import CheckoutDialog from "../components/Cart/CheckoutDialog";

interface CartsCardProps {
  uCart: UCart;
  onOpenEditor: (selectedCart: UCart) => void;
  onCloseEditor: () => void;
  onOpenDelete: (selectedCart: UCart) => void;
  onCloseDelete: () => void;
  onOpenCheckOut: (uCart: UCart) => void;
}
function CartsCard(props: CartsCardProps) {
  return (
    <Card sx={{ width: 300, margin: ".25rem", padding: "0" }}>
      <CardMedia
        sx={{ height: 100 }}
        image={props.uCart.ProductImageURL}
        title={`An image of ${props.uCart.Name}`}
      />
      <CardContent sx={{ width: "100%" }}>
        <Typography variant="h5">{props.uCart.Name}</Typography>
        <Typography variant="body2">{props.uCart.Description}</Typography>
        <Typography variant="body2" sx={{ marginTop: "1rem" }}>
          <b>Total Price: </b>${props.uCart.TotalPrice}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions
        disableSpacing
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box>
          <Tooltip title="Remove from cart">
            <IconButton onClick={() => props.onOpenDelete(props.uCart)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit cart">
            <IconButton onClick={() => props.onOpenEditor(props.uCart)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Checkout">
          <IconButton onClick={() => props.onOpenCheckOut(props.uCart)}>
            <ShoppingCartCheckoutIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

interface CartsViewProps {
  userId: string;
}
export default function CartsView(props: CartsViewProps) {
  const {
    alertSnackbar,
    carts,

    onRemoveFromCart,
    onEditCart,

    selectedCartAddOns,
    onRemoveAddOnFromSelectedCart,
    availableAddOns,
    onRemoveAddOnFromAvaialableAddOns,
    selectedCart,
    quantity,
    onChangeQuantity,
    totalPrice,

    isOpenEditor,
    onOpenEditor,
    onCloseEditor,
    isOpenDelete,
    onOpenDelete,
    onCloseDelete,

    clientName,
    onChangeClientName,
    shipAddress,
    onChangeShippingAddress,
    isOpenCheckout,
    onOpenCheckOut,
    onCloseCheckOut,
    onCheckout,

    checkoutAddOns,
  } = useCartController(props.userId);

  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-wrap w-full max-md:justify-center">
        {carts.map((cart, index) => {
          return (
            <CartsCard
              key={index}
              uCart={cart}
              onOpenDelete={onOpenDelete}
              onCloseDelete={onCloseDelete}
              onOpenEditor={onOpenEditor}
              onCloseEditor={onCloseEditor}
              onOpenCheckOut={onOpenCheckOut}
            />
          );
        })}
      </div>
      <EditCartDialog
        isOpen={isOpenEditor}
        onClose={onCloseEditor}
        onChangeQuantity={onChangeQuantity}
        quantity={quantity}
        totalPrice={totalPrice as number}
        selectedCart={selectedCart}
        onEditCart={onEditCart}
        selectedCartAddOns={selectedCartAddOns}
        onRemoveAddOnFromSelectedCart={onRemoveAddOnFromSelectedCart}
        availableAddOns={availableAddOns}
        onRemoveAddOnFromAvaialableAddOns={onRemoveAddOnFromAvaialableAddOns}
      />
      <DeleteCartDialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        selectedCart={selectedCart}
        onRemoveFromCart={onRemoveFromCart}
      />
      <CheckoutDialog
        isOpen={isOpenCheckout}
        clientName={clientName}
        onChangeClientName={onChangeClientName}
        onChangeShipAddress={onChangeShippingAddress}
        onCheckout={onCheckout}
        onClose={onCloseCheckOut}
        selectedCart={selectedCart}
        shipAddress={shipAddress}
        checkoutAddOns={checkoutAddOns}
      />
      {alertSnackbar}
    </div>
  );
}
