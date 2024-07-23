import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import CoffeeIcon from "@mui/icons-material/Coffee";

import { UCart } from "../model/useCartsModel";
import useCartController from "../controller/useCartController";
import EditCartDialog from "../components/Cart/EditCartDialog";
import DeleteCartDialog from "../components/Cart/DeleteCartDialog";
import CheckoutDialog from "../components/Cart/CheckoutDialog";
import { truncateDescription, truncateName } from "../utils/stringUtils";
import DefaultProductImage from "../assets/images/default-product-image.png";
import { MENU_PAGE } from "../strings";
import "./styles/CartsView.css";

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
        </CardContent>
        <Divider />
        <CardContent sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="subtitle2">₱{props.uCart.TotalPrice}</Typography>
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

  const renderCarts = () => {
    if (carts.length === 0) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: "var(--md-sys-color-outline-variant)",
            }}
          >
            Cart is empty
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: "var(--md-sys-color-outline-variant)",
              marginBottom: ".5rem",
            }}
          >
            Add something to cart by clicking the button below
          </Typography>

          <button
            className="menu-button"
            onClick={() =>
              (window.location.href = `/${MENU_PAGE.toLowerCase()}`)
            }
          >
            <CoffeeIcon sx={{ marginRight: ".25rem" }} />
            Available coffee
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-wrap w-full max-md:justify-center">
          {carts.map((cart, index) => {
            return (
              <CartsCard uCart={cart} key={index} onOpenEditor={onOpenEditor} />
            );
          })}
        </div>
      );
    }
  };

  return (
    <main className="w-screen h-screen p-4">
      {renderCarts()}
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
    </main>
  );
}
