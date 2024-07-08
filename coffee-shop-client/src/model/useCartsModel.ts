import { QuerySnapshot, Unsubscribe } from "firebase/firestore";
import {
  addToCartInFirebase,
  editCartInFirebase,
  listenCartInFirebase,
  removeFromCartInFirebase,
} from "./api/cart";
import { UProduct } from "./useProductsModel";
import { UAddOn } from "./useAddOnsModel";

export interface Cart {
  Name: string;
  Description: string;
  Price: string | number;
  TotalPrice: string | number;
  ProductId: string;
  Quantity: number;
  AddOnIds: string[];
}

export interface UCart extends Cart {
  id: string;
  ProductImageURL: string;
}

const useCartsModel = () => {
  const listenCart = (
    userId: string,
    onCarts: (carts: UCart[] | null) => void
  ): Unsubscribe => {
    const cb = (snapshot: QuerySnapshot | null) => {
      if (snapshot === null) {
        onCarts(null);
        return;
      }
      const cartList: UCart[] = [];
      snapshot.forEach((doc) => {
        const s = doc.data() as Cart;
        const ucart: UCart = {
          id: doc.id,
          Name: s.Name,
          Description: s.Description,
          TotalPrice: s.TotalPrice,
          Price: s.Price,
          ProductId: s.ProductId,
          Quantity: s.Quantity,
          ProductImageURL: "",
          AddOnIds: s.AddOnIds,
        };
        cartList.push(ucart);
      });

      onCarts(cartList);
    };

    return listenCartInFirebase(userId, cb);
  };

  const addToCart = (
    userId: string,
    quantity: number,
    totalPrice: number,
    uAddOns: UAddOn[],
    product: UProduct,
    cb: (success: boolean, cartId: string) => void
  ) => {
    let addOnIds: string[] = [];
    uAddOns.forEach((uAddOn, index) => {
      if (index < 2) {
        addOnIds.push(uAddOn.id);
      }
    });
    const ucart: Cart = {
      Name: product.Name,
      Description: product.Description,
      Price: product.Price,
      TotalPrice: totalPrice,
      ProductId: product.id,
      Quantity: quantity,
      AddOnIds: addOnIds,
    };

    addToCartInFirebase(userId, ucart, cb);
  };

  const removeFromCart = (
    userId: string,
    cartId: string,
    cb: (success: boolean) => void
  ) => {
    removeFromCartInFirebase(userId, cartId, cb);
  };

  const editCart = (
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
    editCartInFirebase(userId, cartId, cart, cb);
  };

  return {
    listenCart,
    addToCart,
    removeFromCart,
    editCart,
  };
};

export default useCartsModel;
