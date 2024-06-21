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
  const { getCarts, removeFromCart, editCartVM, getAddOnsInCart, getAddOns } =
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
  // Available addons from the selected product in the selected cart
  const [availableAddOns, setAvailableAddOns] = useState<UAddOn[]>([]);
  // Total price of product multiplied by the quantity plus addons
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // Quantity of selected product
  const [quantity, setQuantity] = useState<number>(1);

  const onRemoveAddOnFromSelectedCart = (uAddOn: UAddOn) => {
    const newAvailableAddOnsList = [...availableAddOns, uAddOn];
    // TODO: Decrease totalPrice when addon is removed
    // TODO: Implementation
    console.log(uAddOn);
  };

  const onRemoveAddOnFromAvaialableAddOns = (uAddOn: UAddOn) => {
    // TODO: Increase totalPrice when addon is added
    // TODO: Implementation
    console.log(uAddOn);
  };

  const filterAddOnsAlreadyListed = (uAddOns: UAddOn[]) => {
    // This will filter out available addons already listed in selectedCartAddOns
    const isAddOnInSelectedCartAddOns = (targetUAddOn: UAddOn) => {
      const addOn = selectedCartAddOns.find((uAddOn: UAddOn) => {
        return uAddOn.AddOnId === targetUAddOn.id;
      });
      if (addOn === undefined) {
        return false;
      } else {
        return true;
      }
    };

    return uAddOns.filter((uAddOn: UAddOn) => {
      return !isAddOnInSelectedCartAddOns(uAddOn);
    });
  };
  const onGetAddOnsForProductInSelectedCart = (): Unsubscribe => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns === null) {
        notify.HandleOpenAlert("error", "Error fetching addons");
      } else {
        const addOnsCopy = [...uAddOns];
        const filteredAddOns = filterAddOnsAlreadyListed(addOnsCopy);

        filteredAddOns.forEach((value) => console.log(value));
        setAvailableAddOns(filteredAddOns);
      }
    };
    return getAddOns(selectedCart.ProductId, onAddOns);
  };
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
    let unsubsribeAddOnsProduct: Unsubscribe | null = null;

    if (isOpenEditor) {
      console.log(
        `[useCartController] Adding addons listener for product ${selectedCart.Name}`
      );
      unsubsribeAddOnsProduct = onGetAddOnsForProductInSelectedCart();
    } else {
      if (unsubsribeAddOnsProduct !== null) {
        console.log(
          `[useCartController] Removing addons listener for product ${selectedCart.Name}`
        );
        const unsubAddOnsProduct = unsubsribeAddOnsProduct as Unsubscribe;
        unsubAddOnsProduct();
      }
    }
    return () => {
      if (unsubsribeAddOnsProduct !== null) {
        console.log(
          `[useCartController] Removing addons listener for product ${selectedCart.Name}`
        );
        unsubsribeAddOnsProduct();
      }
    };
  }, [selectedCartAddOns]);

  useEffect(() => {
    let unsubscribeAddOnsSelectedCart: Unsubscribe | null = null;

    if (isOpenEditor) {
      console.log(
        `[useCartController] Adding addons listener for cart ${selectedCart.Name}`
      );
      unsubscribeAddOnsSelectedCart = onGetAddOnsForSelectedCart();
    } else {
      if (unsubscribeAddOnsSelectedCart !== null) {
        console.log(
          `[useCartController] Removing addons listener for cart ${selectedCart.Name}`
        );
        const unsubAddOnsCart = unsubscribeAddOnsSelectedCart as Unsubscribe;
        unsubAddOnsCart();
      }
    }
    return () => {
      if (unsubscribeAddOnsSelectedCart !== null) {
        console.log(
          `[useCartController] Removing addons listener for cart ${selectedCart.Name}`
        );
        unsubscribeAddOnsSelectedCart();
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
    setQuantity(selectedCart.Quantity);
    setTotalPrice(selectedCart.TotalPrice as number);
    setIsOpenEditor(true);
  };
  const onCloseEditor = () => {
    // TODO: Clean data
    setIsOpenEditor(false);

    setSelectedCart(emptyCart);
    setSelectedCartAddOns([]);
    setAvailableAddOns([]);
    setQuantity(1);
    setTotalPrice(0);
  };

  const onChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (parseInt(value) < 0) return;
    // TODO: Change quantity
    // TODO: Change totalPrice when quantity increases
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
    setSelectedCartAddOns([]);
    setAvailableAddOns([]);
    setQuantity(1);
    setTotalPrice(0);
  };

  useEffect(() => {
    const onCartsVM = (carts: UCart[] | null) => {
      if (carts === null) {
        notify.HandleOpenAlert("error", "Failed to fetched cart data");
        return;
      }
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

  // const quantity = selectedCart.Quantity;
  // const totalPrice = selectedCart.TotalPrice;
  return {
    alertSnackbar,
    carts,

    onRemoveFromCart,
    onEditCart,

    selectedCartAddOns,
    onRemoveAddOnFromSelectedCart,
    availableAddOns,
    onRemoveAddOnFromAvaialableAddOns,
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
