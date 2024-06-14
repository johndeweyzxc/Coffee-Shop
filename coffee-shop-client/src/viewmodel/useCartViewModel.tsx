import { Cart, UCart } from "../model/api/cart";
import useCartsModel from "../model/useCartsModel";
import { UProduct } from "../model/api/products";
import useAddOnsModel from "../model/useAddOnsModel";
import { UAddOn } from "../model/api/addons";

export const useCartViewModel = () => {
  const { getCarts, addToCart, removeFromCart, editCart } = useCartsModel();
  const { getAddOnsInCart, appendAddOnsInCart } = useAddOnsModel();

  const editCartVM = (
    userId: string,
    cartId: string,
    totalPrice: number | string,
    newCart: UCart,
    cb: (success: boolean) => void
  ) => {
    const cart: Cart = {
      Name: newCart.Name,
      Description: newCart.Description,
      Price: newCart.Price,
      TotalPrice: totalPrice,
      ProductId: newCart.ProductId,
      Quantity: newCart.Quantity,
    };
    editCart(userId, cartId, cart, cb);
  };

  const addToCartVM = (
    userId: string,
    quantity: number,
    totalPrice: number,
    product: UProduct,
    uAddOns: UAddOn[],
    cb: (success: boolean) => void
  ) => {
    const newAddOnList: UAddOn[] = [];
    uAddOns.forEach((addOn) => {
      const newAddOn: UAddOn = {
        ...addOn,
        Price: parseInt(addOn.Price as string),
      };
      newAddOnList.push(newAddOn);
    });

    const onAddedToCart = (success: boolean, cartId: string) => {
      if (success) {
        newAddOnList.forEach((uAddOn) => {
          const onAddedAdOns = (success: boolean) => {
            if (!success) cb(false);
          };
          appendAddOnsInCart(userId, cartId, uAddOn, onAddedAdOns);
        });
        cb(true);
      } else {
        cb(false);
      }
    };

    addToCart(userId, quantity, totalPrice, product, onAddedToCart);
  };

  return {
    getCarts,
    addToCartVM,
    removeFromCart,
    editCartVM,

    getAddOnsInCart,
  };
};
