import { UCart } from "../model/api/cart";
import useCartsModel from "../model/useCartsModel";
import { UProduct } from "../model/api/products";
import useAddOnsModel from "../model/useAddOnsModel";
import { AddOn, UAddOn } from "../model/api/addons";

export const useCartViewModel = () => {
  const { getCarts, addToCart, removeFromCart, editCart } = useCartsModel();
  const { getAddOnsInCart, appendAddOnsInCart, getAddOns, removeAddOnInCart } =
    useAddOnsModel();

  const editCartVM = (
    userId: string,
    cartId: string,
    newCart: UCart,
    cb: (success: boolean) => void
  ) => {
    const cart: object = {
      Name: newCart.Name,
      Description: newCart.Description,
      Price: newCart.Price,
      TotalPrice: newCart.TotalPrice,
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

  const appendAddOnsInCartVM = (
    userId: string,
    cartId: string,
    uAddOn: UAddOn,
    cb: (success: boolean) => void
  ) => {
    const addOn: AddOn = {
      AddOnId: uAddOn.id,
      Name: uAddOn.Name,
      Price: uAddOn.Price,
    };

    appendAddOnsInCart(userId, cartId, addOn, cb);
  };

  return {
    getCarts,
    addToCartVM,
    removeFromCart,
    editCartVM,

    getAddOns,
    getAddOnsInCart,
    appendAddOnsInCartVM,
    removeAddOnInCart,
  };
};
