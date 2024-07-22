import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

import { UOrder } from "../model/useOrderModel";
import useOrderController from "../controller/useOrderController";
import ViewOrderDialog from "../components/Order/ViewOrderDialog";
import DefaultProductImage from "../assets/images/default-product-image.png";
import { truncateDescription, truncateName } from "../utils/stringUtils";

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
          <Typography variant="body2" sx={{ marginTop: "1rem" }}>
            <b>Total Price: </b>${props.uOrder.ProductOrderInfo.TotalPrice}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: ".25rem" }}>
            <b>Status: </b>
            {props.uOrder.Status}
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

  return (
    <div className="w-screen h-screen p-4">
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
      <ViewOrderDialog
        isOpen={isOpenOrderDialog}
        onClose={onCloseOrderDialog}
        currAddOns={currAddOns}
        selectedOrder={currentOrder}
      />
      {snackbar}
    </div>
  );
}
