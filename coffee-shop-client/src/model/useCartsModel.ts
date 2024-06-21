import { QuerySnapshot, Unsubscribe } from "firebase/firestore";
import {
  Cart,
  UCart,
  addToCartInFirebase,
  editCartInFirebase,
  getCartInFirebase,
  removeFromCartInFirebase,
} from "./api/cart";
import { UProduct } from "./api/products";

const useCartsModel = () => {
  const getCarts = (
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
        };
        cartList.push(ucart);
      });

      onCarts(cartList);
    };

    return getCartInFirebase(userId, cb);
  };

  const addToCart = (
    userId: string,
    quantity: number,
    totalPrice: number,
    product: UProduct,
    cb: (success: boolean, cartId: string) => void
  ) => {
    const ucart: Cart = {
      Name: product.Name,
      Description: product.Description,
      Price: product.Price,
      TotalPrice: totalPrice,
      ProductId: product.id,
      Quantity: quantity,
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
    newCart: Cart,
    cb: (success: boolean) => void
  ) => {
    editCartInFirebase(userId, cartId, newCart, cb);
  };

  return {
    getCarts,
    addToCart,
    removeFromCart,
    editCart,
  };
};

export default useCartsModel;