import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import CoffeeIcon from "@mui/icons-material/Coffee";

import { UOrder } from "../model/useOrderModel";
import useOrderController from "../controller/useOrderController";
import ViewOrderDialog from "../components/Order/ViewOrderDialog";
import { truncateDescription, truncateName } from "../utils/stringUtils";
import DefaultProductImage from "../assets/images/default-product-image.png";
import { MENU_PAGE } from "../strings";
import "./styles/OrdersView.css";

interface OrderCardProps {
  uOrder: UOrder;
  onOrderClicked: (uOrder: UOrder) => void;
}
function OrderCard(props: OrderCardProps) {
  return (
    <Card sx={{ width: 300, margin: ".5rem", padding: "0" }}>
      <CardActionArea onClick={() => props.onOrderClicked(props.uOrder)}>
        <CardMedia
          sx={{ height: 200 }}
          image={
            props.uOrder.ProductImageURL === ""
              ? DefaultProductImage
              : props.uOrder.ProductImageURL
          }
          title={`An image of ${props.uOrder.ProductOrderInfo.Name}`}
        />
        <CardContent sx={{ width: "100%" }}>
          <Typography variant="h5">
            {truncateName(props.uOrder.ProductOrderInfo.Name)}
          </Typography>
          <Typography variant="body2">
            {truncateDescription(props.uOrder.ProductOrderInfo.Description)}
          </Typography>
        </CardContent>
        <Divider />
        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle2">{props.uOrder.Status}</Typography>
          <Typography variant="subtitle2">
            ₱{props.uOrder.ProductOrderInfo.TotalPrice}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

interface OrdersViewProps {
  userId: string;
}
export default function OrdersView(props: OrdersViewProps) {
  const {
    snackbar,

    orders,
    currentOrder,
    onOrderClicked,
    isOpenOrderDialog,
    onCloseOrderDialog,
    currAddOns,
  } = useOrderController(props.userId);

  const renderOrders = () => {
    if (orders.length === 0) {
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
            Order is empty
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
            Order now by clicking the button below
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
          {orders.map((uOrder, index) => {
            return (
              <OrderCard
                onOrderClicked={onOrderClicked}
                uOrder={uOrder}
                key={index}
              />
            );
          })}
        </div>
      );
    }
  };

  return (
    <main className="w-screen h-screen p-4">
      {renderOrders()}
      <ViewOrderDialog
        isOpen={isOpenOrderDialog}
        onClose={onCloseOrderDialog}
        currAddOns={currAddOns}
        selectedOrder={currentOrder}
      />
      {snackbar}
    </main>
  );
}
