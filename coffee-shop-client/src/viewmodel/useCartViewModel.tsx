import { UCart } from "../model/api/cart";
import useCartsModel from "../model/useCartsModel";
import { UProduct } from "../model/api/products";
import useAddOnsModel from "../model/useAddOnsModel";
import { AddOn, UAddOn } from "../model/api/addons";
import { Unsubscribe } from "firebase/firestore";
import useProductsModel from "../model/useProductsModel";

export const useCartViewModel = () => {
  // TODO: Remove the AddOns column residual when a cart is deleted

  const { getCarts, addToCart, removeFromCart, editCart } = useCartsModel();
  const { getAddOnsInCart } = useAddOnsModel();
  const {
    listenAddOnsInCart,
    appendAddOnsInCart,
    listenAddOns,
    removeAddOnInCart,
  } = useAddOnsModel();
  const { getProductImageURL } = useProductsModel();

  const getCartsVM = (
    userId: string,
    onCarts: (carts: UCart[] | null) => void
  ): Unsubscribe => {
    let listUCartVM: UCart[] = [];
    let totalCarts: number | undefined = 0;
    let cartsProcessed = 0;

    const createCartVM = (cart: UCart) => {
      const onGotCartImageUrl = (url: string) => {
        const newUCartVM: UCart = { ...cart, ProductImageURL: url };
        listUCartVM = [...listUCartVM, newUCartVM];
        cartsProcessed++;

        if (totalCarts === cartsProcessed) {
          onCarts(listUCartVM);
          cartsProcessed = 0;
        }
      };
      getProductImageURL(cart.ProductId, onGotCartImageUrl);
    };

    const onReceivedCarts = (carts: UCart[] | null) => {
      totalCarts = carts?.length;
      listUCartVM = [];
      if (totalCarts === 0) {
        onCarts([]);
      } else {
        carts?.forEach((cart) => createCartVM(cart));
      }
    };

    return getCarts(userId, onReceivedCarts);
  };

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
    const newAddOnList: AddOn[] = [];
    uAddOns.forEach((addOn) => {
      const newAddOn: AddOn = {
        AddOnId: addOn.id,
        Name: addOn.Name,
        Price: addOn.Price,
      };
      newAddOnList.push(newAddOn);
    });

    const onAddedToCart = (success: boolean, cartId: string) => {
      if (success) {
        newAddOnList.forEach((addOn) => {
          const onAddedAdOns = (success: boolean) => {
            if (!success) cb(false);
          };
          appendAddOnsInCart(userId, cartId, addOn, onAddedAdOns);
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
    getCartsVM,
    addToCartVM,
    removeFromCart,
    editCartVM,

    getAddOnsInCart,
    listenAddOns,
    listenAddOnsInCart,
    appendAddOnsInCartVM,
    removeAddOnInCart,
  };
};
