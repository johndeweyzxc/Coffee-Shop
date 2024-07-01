import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import useMenuController from "../controller/useMenuController";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SetQuantityDialog from "../components/Menu/SetQuantityDialog";

interface MenuViewProps {
  userId: string;
}
export default function MenuView(props: MenuViewProps) {
  const {
    alertSnackbar,

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

  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-wrap w-full max-md:justify-center">
        {products.map((product, index) => {
          return (
            <Card key={index} sx={{ width: 300, margin: ".25rem" }}>
              <CardMedia
                sx={{ height: 100 }}
                image={product.ProductImageURL}
                title={`An image of ${product.Name}`}
              />
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
    </div>
  );
}
