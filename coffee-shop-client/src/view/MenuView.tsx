import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import useMenuController from "../controller/useMenuController";
import AddCartDialog from "../components/Menu/AddCartDialog";
import DefaultProductImage from "../assets/images/default-product-image.png";
import { truncateDescription, truncateName } from "../utils/stringUtils";
import { UProduct } from "../model/useProductsModel";

interface MenuViewProps {
  userId: string;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onCloseLogin: () => void;
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

  const onAddToCartButtonClicked = (product: UProduct) => {
    if (props.isLoggedIn) {
      props.onCloseLogin();
      onAddToCart(product);
    } else {
      props.onOpenLogin();
    }
  };

  const renderProductCart = (product: UProduct, index: number) => {
    return (
      <Card key={index} sx={{ width: 300, margin: ".5rem" }}>
        <CardActionArea onClick={() => onAddToCartButtonClicked(product)}>
          <CardMedia
            sx={{ height: 200, objectFit: "fill" }}
            image={
              product.ProductImageURL === ""
                ? DefaultProductImage
                : product.ProductImageURL
            }
            title={`An image of ${product.Name}`}
          />
          <CardContent>
            <Typography variant="h5">{truncateName(product.Name)}</Typography>
            <Typography variant="body2">
              {truncateDescription(product.Description)}
            </Typography>
            <Typography
              variant="h6"
              sx={{ marginTop: ".75rem", textAlign: "end" }}
            >
              ₱{product.Price}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-wrap w-full max-md:justify-center">
        {products.map((product, index) => renderProductCart(product, index))}
      </div>
      {alertSnackbar}
      <AddCartDialog
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
