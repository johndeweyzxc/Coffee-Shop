import useCartsModel, { UCart } from "../model/useCartsModel";
import useAddOnsModel, { UAddOn } from "../model/useAddOnsModel";
import { Unsubscribe } from "firebase/firestore";
import useProductsModel, { UProduct } from "../model/useProductsModel";

export const useCartViewModel = () => {
  const { listenCart, addToCart, removeFromCart, editCart } = useCartsModel();
  const {
    listenAddOnsFromProduct,
    listenAddOnsFromCart,
    getAddOnsFromCart,
    appendAddOnInCart,
    removeAddOnInCart,
  } = useAddOnsModel();
  const { getProductImageURL } = useProductsModel();

  const listenCartVM = (
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

    return listenCart(userId, onReceivedCarts);
  };

  const editCartVM = (
    userId: string,
    cartId: string,
    quantity: number,
    totalPrice: number,
    selectedCartAddOns: UAddOn[],
    uCart: UCart,
    cb: (success: boolean) => void
  ) => {
    let addOnIds: string[] = [];
    selectedCartAddOns.forEach((uAddOn) => addOnIds.push(uAddOn.id));
    const newSelectedCart: UCart = {
      ...uCart,
      AddOnIds: addOnIds,
      Quantity: quantity,
      TotalPrice: totalPrice,
    };
    editCart(userId, cartId, newSelectedCart, cb);
  };

  const addToCartVM = (
    userId: string,
    quantity: number,
    totalPrice: number,
    product: UProduct,
    uAddOns: UAddOn[],
    cb: (success: boolean) => void
  ) => {
    const onAddedToCart = (success: boolean, cartId: string) => {
      if (success) {
        uAddOns.forEach((uAddOn) => {
          const onAddedAddOns = (success: boolean) => {
            if (!success) cb(false);
          };
          // * 2. Copy each AddOn document from product into cart
          appendAddOnInCart(userId, cartId, product.id, uAddOn, onAddedAddOns);
        });
        cb(true);
      } else {
        cb(false);
      }
    };
    // * 1. Upload cart by copying product info from product into cart
    addToCart(userId, quantity, totalPrice, uAddOns, product, onAddedToCart);
  };

  const appendAddOnsInCartVM = (
    userId: string,
    uCart: UCart,
    uAddOn: UAddOn,
    cb: (success: boolean) => void
  ) => {
    const onUpdatedIdsInCart = (success: boolean) => {
      if (success) {
        cb(true);
      } else {
        cb(false);
      }
    };
    const onAppendedAddOn = (success: boolean, addOnId: string) => {
      if (success) {
        const newUAddOnIdList = [...uCart.AddOnIds, addOnId];
        const newUCart: UCart = { ...uCart, AddOnIds: newUAddOnIdList };
        editCart(userId, uCart.id, newUCart, onUpdatedIdsInCart);
      } else {
        cb(false);
      }
    };
    appendAddOnInCart(
      userId,
      uCart.id,
      uCart.ProductId,
      uAddOn,
      onAppendedAddOn
    );
  };

  const removeFromCartVM = (
    userId: string,
    cartId: string,
    cb: (success: boolean) => void
  ) => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      let deletedAddOns = 1;
      const onRemovedAddOnInCart = (success: boolean) => {
        if (success) {
          if (uAddOns?.length === deletedAddOns) {
            cb(true);
          }
        } else {
          cb(false);
        }
        deletedAddOns++;
      };
      uAddOns?.forEach((uAddOn) => {
        removeAddOnInCart(userId, cartId, uAddOn.id, onRemovedAddOnInCart);
      });
    };

    const onRemovedFromCart = (success: boolean) => {
      if (success) {
        getAddOnsFromCart(userId, cartId, onAddOns);
      } else {
        cb(false);
      }
    };
    removeFromCart(userId, cartId, onRemovedFromCart);
  };

  const removeAddOnInCartVM = (
    userId: string,
    uCart: UCart,
    addOnId: string,
    cb: (success: boolean) => void
  ) => {
    const newUAddOnIdList = uCart.AddOnIds.filter(
      (uAddOnId) => uAddOnId !== addOnId
    );
    const newUCart: UCart = { ...uCart, AddOnIds: newUAddOnIdList };

    const onUpdatedIdsOnCart = (success: boolean) => {
      if (success) {
        cb(true);
      } else {
        cb(false);
      }
    };
    const onRemovedAddOn = (success: boolean) => {
      if (success) {
        editCart(userId, uCart.id, newUCart, onUpdatedIdsOnCart);
      } else {
        cb(false);
      }
    };
    removeAddOnInCart(userId, uCart.id, addOnId, onRemovedAddOn);
  };

  return {
    listenCartVM,
    addToCartVM,
    removeFromCartVM,
    editCartVM,

    getAddOnsFromCart,
    listenAddOnsFromProduct,
    listenAddOnsFromCart,
    appendAddOnsInCartVM,
    removeAddOnInCartVM,
  };
};
