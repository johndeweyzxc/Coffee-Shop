import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { UCart } from "../model/useCartsModel";
import useCartController from "../controller/useCartController";
import EditCartDialog from "../components/Cart/EditCartDialog";
import DeleteCartDialog from "../components/Cart/DeleteCartDialog";
import CheckoutDialog from "../components/Cart/CheckoutDialog";
import DefaultProductImage from "../assets/images/default-product-image.png";
import { truncateDescription, truncateName } from "../utils/stringUtils";

interface CartsCardProps {
  uCart: UCart;
  onOpenEditor: (selectedCart: UCart) => void;
}
function CartsCard(props: CartsCardProps) {
  return (
    <Card sx={{ width: 300, margin: ".5rem", padding: "0" }}>
      <CardActionArea onClick={() => props.onOpenEditor(props.uCart)}>
        <CardMedia
          sx={{ height: 200 }}
          image={
            props.uCart.ProductImageURL === ""
              ? DefaultProductImage
              : props.uCart.ProductImageURL
          }
          title={`An image of ${props.uCart.Name}`}
        />
        <CardContent sx={{ width: "100%" }}>
          <Typography variant="h5">{truncateName(props.uCart.Name)}</Typography>
          <Typography variant="body2">
            {truncateDescription(props.uCart.Description)}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: "1rem" }}>
            <b>Total Price: </b>₱{props.uCart.TotalPrice}
          </Typography>
        </CardContent>
      </CardActionArea>
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
    shipInfoErrText,
    onCheckout,

    checkoutAddOns,
  } = useCartController(props.userId);

  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-wrap w-full max-md:justify-center">
        {carts.map((cart, index) => {
          return (
            <CartsCard uCart={cart} key={index} onOpenEditor={onOpenEditor} />
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
        onOpenCheckOut={onOpenCheckOut}
        onCloseCheckOut={onCloseCheckOut}
        onOpenDelete={onOpenDelete}
        onCloseDelete={onCloseDelete}
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
        shipInfoErrText={shipInfoErrText}
      />
      {alertSnackbar}
    </div>
  );
}
