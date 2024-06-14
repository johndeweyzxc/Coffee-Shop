import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import useMenuController from "../controller/useMenuController";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SetQuantityDialog from "../components/Menu/SetQuantityDialog";
import LoginWGoogle from "../components/Login/LoginWGoogle";

interface MenuViewProps {
  userId: string;
}
export default function MenuView(props: MenuViewProps) {
  const {
    alertSnackbar,

    isOpenLoginWGoogle,
    onOpenLoginWGoogle,
    onCloseLoginWGoogle,
    onLoginWithGoogle,

    isOpenQuantity,
    onCloseQuantity,
    quantity,
    onChangeQuantity,
    onQuantitySet,
    selectedProduct,
    totalPrice,

    selectedProdAddOns,
    currentAddOns,
    onAddAddon,
    onRemoveAddon,

    products,
    onAddToCart,
  } = useMenuController();

  // TODO: Implement add on feature

  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-wrap w-full">
        {products.map((product, index) => {
          return (
            <Card key={index} sx={{ width: 300, margin: ".25rem" }}>
              <CardContent>
                <Typography variant="h5">{product.Name}</Typography>
                <Typography variant="body2">{product.Description}</Typography>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Tooltip title={"Add to cart"}>
                  <IconButton onClick={() => onAddToCart(product)}>
                    <AddShoppingCartIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="h6">₱{product.Price}</Typography>
              </CardActions>
            </Card>
          );
        })}
      </div>
      {alertSnackbar}
      <SetQuantityDialog
        isOpen={isOpenQuantity}
        onClose={onCloseQuantity}
        quantity={quantity}
        uProduct={selectedProduct}
        currentAddOns={currentAddOns}
        onAddAddon={onAddAddon}
        onRemoveAddon={onRemoveAddon}
        selectedProdAddOns={selectedProdAddOns}
        totalPrice={totalPrice}
        onChangeQuantity={onChangeQuantity}
        onQuantitySet={() => onQuantitySet(props.userId)}
      />
      <LoginWGoogle
        isOpen={isOpenLoginWGoogle}
        onClose={onCloseLoginWGoogle}
        onLoginWithGoogle={onLoginWithGoogle}
      />
    </div>
  );
}
