import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import useCartController from "../controller/useCartController";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCartDialog from "../components/Cart/EditCartDialog";
import DeleteCartDialog from "../components/Cart/DeleteCartDialog";
import { UCart } from "../model/api/cart";

interface CartsCardProps {
  uCart: UCart;
  onOpenEditor: (selectedCart: UCart) => void;
  onCloseEditor: () => void;
  onOpenDelete: (selectedCart: UCart) => void;
  onCloseDelete: () => void;
}
function CartsCard(props: CartsCardProps) {
  return (
    <Card sx={{ width: 300, margin: ".25rem" }}>
      <CardContent>
        <Typography variant="h5">{props.uCart.Name}</Typography>
        <Typography variant="body2">{props.uCart.Description}</Typography>
        <Typography variant="body2" sx={{ marginTop: "1rem" }}>
          <b>Price: </b>${props.uCart.Price}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: ".5rem" }}>
          <b>Quantity: </b>
          {props.uCart.Quantity}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: ".5rem" }}>
          <b>Total Price: </b>${props.uCart.TotalPrice}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title="Remove from cart">
          <IconButton onClick={() => props.onOpenDelete(props.uCart)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Edit cart">
          <IconButton onClick={() => props.onOpenEditor(props.uCart)}>
            <EditIcon />
          </IconButton>
        </Tooltip> */}
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
  } = useCartController(props.userId);
  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-wrap w-full">
        {carts.map((cart, index) => {
          return (
            <CartsCard
              key={index}
              uCart={cart}
              onOpenDelete={onOpenDelete}
              onCloseDelete={onCloseDelete}
              onOpenEditor={onOpenEditor}
              onCloseEditor={onCloseEditor}
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
      />
      <DeleteCartDialog
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        selectedCart={selectedCart}
        onRemoveFromCart={onRemoveFromCart}
      />
      {alertSnackbar}
    </div>
  );
}
