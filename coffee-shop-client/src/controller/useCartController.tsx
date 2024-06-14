import { ChangeEvent, useEffect, useState } from "react";
import Notification from "../components/Notification";
import { useCartViewModel } from "../viewmodel/useCartViewModel";
import { UCart } from "../model/api/cart";
import { UAddOn } from "../model/api/addons";
import { Unsubscribe } from "firebase/auth";

const useCartController = (userId: string) => {
  const emptyCart = {
    id: "",
    Name: "",
    Description: "",
    Price: 0,
    ProductId: "",
    Quantity: 0,
    TotalPrice: 0,
    AddOns: [],
  };

  const notify = Notification();
  const { getCarts, removeFromCart, editCartVM, getAddOnsInCart } =
    useCartViewModel();

  // * STATE MANAGEMENT FOR CARTS
  // Use in dialog for editing cart
  const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false);
  // Use in dialog for deleting cart
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  // Placeholder when a cart is clicked
  const [selectedCart, setSelectedCart] = useState<UCart>(emptyCart);
  // Items added to cart by the user
  const [carts, setCarts] = useState<UCart[]>([]);
  // Addons listed from the selected cart
  const [selectedCartAddOns, setSelectedCartAddOns] = useState<UAddOn[]>([]);

  const onGetAddOnsForSelectedCart = (): Unsubscribe => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns === null) {
        notify.HandleOpenAlert("error", "Error fetching addons");
      } else {
        setSelectedCartAddOns(uAddOns);
      }
    };
    return getAddOnsInCart(userId, selectedCart.id, onAddOns);
  };
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (isOpenEditor) {
      console.log(
        `[useCartController] Adding addons listener for product ${selectedCart.Name}`
      );
      unsubscribe = onGetAddOnsForSelectedCart();
    } else {
      console.log(
        `[useCartController] Removing addons listener for product ${selectedCart.Name}`
      );
      if (unsubscribe !== null) {
        const unsub = unsubscribe as Unsubscribe;
        unsub();
      }
    }
    return () => {
      if (unsubscribe !== null) {
        unsubscribe();
      }
    };
  }, [isOpenEditor]);

  const onRemoveFromCart = () => {
    const onDeletedCart = (success: boolean) => {
      if (success) {
        notify.HandleOpenAlert("success", "Successfully removed from cart");
      } else {
        notify.HandleOpenAlert("error", "Failed to remove from cart");
      }
    };
    onCloseDelete();
    removeFromCart(userId, selectedCart.id, onDeletedCart);
  };
  const onEditCart = () => {
    const onEditedCart = (success: boolean) => {
      if (success) {
        notify.HandleOpenAlert("success", "Successfully edited cart");
      } else {
        notify.HandleOpenAlert("error", "Failed to edit cart");
      }
    };
    onCloseEditor();
    editCartVM(userId, selectedCart.id, totalPrice, selectedCart, onEditedCart);
  };
  const onOpenEditor = (selectedCart: UCart) => {
    setSelectedCart(selectedCart);
    setIsOpenEditor(true);
  };
  const onCloseEditor = () => {
    setIsOpenEditor(false);
    setSelectedCart(emptyCart);
  };

  const onChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (parseInt(value) < 0) return;
    const totalPrice = (selectedCart.Price as number) * parseInt(value);
    setSelectedCart({
      ...selectedCart,
      Quantity: parseInt(value),
      TotalPrice: totalPrice,
    });
  };
  const onOpenDelete = (selectedCart: UCart) => {
    setSelectedCart(selectedCart);
    setIsOpenDelete(true);
  };
  const onCloseDelete = () => {
    setIsOpenDelete(false);
    setSelectedCart(emptyCart);
  };

  useEffect(() => {
    const onCartsVM = (carts: UCart[] | null) => {
      if (carts === null) {
        notify.HandleOpenAlert("error", "Failed to fetched cart data");
        return;
      }
      carts.forEach((cart) => console.log(cart));
      setCarts(carts);
    };

    if (userId !== "") {
      console.log("[useCartController] Adding cart listener");
      const unsubscribeCart = getCarts(userId, onCartsVM);
      return () => {
        console.log("[useCartController] Removing cart listener");
        unsubscribeCart();
      };
    }
  }, [userId]);

  const alertSnackbar = notify.SnackBar;
  const quantity = selectedCart.Quantity;
  const totalPrice = selectedCart.TotalPrice;
  return {
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
  };
};

export default useCartController;
