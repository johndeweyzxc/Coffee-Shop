import { ChangeEvent, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

import { ShippingAddress } from "../model/useOrderModel";
import { UCart } from "../model/useCartsModel";
import { UAddOn } from "../model/useAddOnsModel";
import { useCartViewModel } from "../viewmodel/useCartViewModel";
import { useOrderViewModel } from "../viewmodel/useOrderViewModel";
import Notification from "../components/Notification";

const useCartController = (userId: string) => {
  const EMPTY_CART = () => {
    return {
      id: "",
      Name: "",
      Description: "",
      Price: 0,
      ProductId: "",
      Quantity: 0,
      TotalPrice: 0,
      AddOnIds: [],
      ProductImageURL: "",
    };
  };

  const EMPTY_SHIPPING_ADDRESS = () => {
    return {
      Region: "",
      City: "",
      District: "",
      Street: "",
    };
  };

  const notify = Notification();
  const {
    listenCartVM,
    removeFromCartVM,
    editCartVM,

    getAddOnsFromCart,
    listenAddOnsFromCart,
    listenAddOnsFromProduct,
    appendAddOnsInCartVM,
    removeAddOnInCartVM,
  } = useCartViewModel();

  const { uploadOrderVM, validateOrderVM } = useOrderViewModel();

  // * STATE MANAGEMENT FOR CARTS
  // Use in dialog for editing cart
  const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false);
  // Use in dialog for deleting cart
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  // Placeholder when a cart is clicked
  const [selectedCart, setSelectedCart] = useState<UCart>(EMPTY_CART());
  // Items added to cart by the user
  const [carts, setCarts] = useState<UCart[]>([]);
  // Addons listed from the selected cart when edit dialog appears
  const [selectedCartAddOns, setSelectedCartAddOns] = useState<UAddOn[]>([]);
  // Available addons from the selected product in the selected cart
  const [availableAddOns, setAvailableAddOns] = useState<UAddOn[]>([]);
  // Total price of product multiplied by the quantity plus addons
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // Quantity of selected product
  const [quantity, setQuantity] = useState<number>(1);
  // Shipping address information for checking out
  const [shipAddress, setShipAddress] = useState<ShippingAddress>(
    EMPTY_SHIPPING_ADDRESS()
  );
  // Use in dialog for checking out a cart
  const [isOpenCheckout, setIsOpenCheckout] = useState<boolean>(false);
  // Client's name to be use when checking out a cart
  const [clientName, setClientName] = useState<string>("");
  // When checkout dialog appears, list all selected addons for that cart
  const [checkoutAddOns, setCheckoutAddOns] = useState<UAddOn[]>([]);
  // Error text for shipping information
  const [shipInfoErrText, setShipInfoErrText] = useState<string>("");

  const onRemoveAddOnFromSelectedCart = (uAddOn: UAddOn) => {
    const onRemovedAddOn = (success: boolean) => {
      if (success) {
        setTotalPrice((prev) => 1 * (prev - (uAddOn.Price as number)));
      } else {
        notify.HandleOpenAlert(
          "error",
          "Failed to remove addon from selected addons"
        );
      }
    };
    removeAddOnInCartVM(userId, selectedCart, uAddOn.id, onRemovedAddOn);
  };

  const onRemoveAddOnFromAvaialableAddOns = (uAddOn: UAddOn) => {
    const onRemovedAddOn = (success: boolean) => {
      if (success) {
        setTotalPrice((prev) => 1 * (prev + (uAddOn.Price as number)));
      } else {
        notify.HandleOpenAlert(
          "error",
          "Failed to add addon to selected addons"
        );
      }
    };
    appendAddOnsInCartVM(userId, selectedCart, uAddOn, onRemovedAddOn);
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

        setAvailableAddOns(filteredAddOns);
      }
    };
    return listenAddOnsFromProduct(selectedCart.ProductId, onAddOns);
  };
  const onGetAddOnsForSelectedCart = (): Unsubscribe => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns === null) {
        notify.HandleOpenAlert("error", "Error fetching addons");
      } else {
        setSelectedCartAddOns(uAddOns);
      }
    };
    return listenAddOnsFromCart(userId, selectedCart.id, onAddOns);
  };
  useEffect(() => {
    // TODO: Instead of attaching a listener, just fetch all addons
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCartAddOns]);

  useEffect(() => {
    // TODO: Instead of attaching a listener, just fetch all addons
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenEditor]);

  const onRemoveFromCart = () => {
    const onDeletedCart = (success: boolean) => {
      if (success) {
        notify.HandleOpenAlert("success", "Successfully removed from cart");
      } else {
        notify.HandleOpenAlert("error", "Failed to remove from cart");
      }
    };
    removeFromCartVM(userId, selectedCart.id, onDeletedCart);
    onCloseDelete();
  };
  const onEditCart = (dialogImproperlyClosed: boolean): [number, number] => {
    const onEditedCart = (success: boolean) => {
      if (dialogImproperlyClosed) return;
      if (success) {
        notify.HandleOpenAlert("success", "Successfully edited cart");
      } else {
        notify.HandleOpenAlert("error", "Failed to edit cart");
      }
    };
    editCartVM(
      userId,
      selectedCart.id,
      quantity,
      totalPrice,
      selectedCartAddOns,
      selectedCart,
      onEditedCart
    );
    onCloseEditor();
    return [quantity, totalPrice];
  };
  const onOpenEditor = (selectedCart: UCart) => {
    setSelectedCart(selectedCart);
    setQuantity(selectedCart.Quantity);
    setTotalPrice(selectedCart.TotalPrice as number);
    setIsOpenEditor(true);
  };
  const onCloseEditor = () => {
    setIsOpenEditor(false);
    setSelectedCart(EMPTY_CART());
    setSelectedCartAddOns([]);
    setAvailableAddOns([]);
    setQuantity(1);
    setTotalPrice(0);
  };

  const onChangeQuantity = (isIncrement: boolean) => {
    if (!isIncrement) {
      if (quantity === 1) {
        return;
      } else if (quantity > 1) {
        setQuantity((prev) => (prev -= 1));
      }
    } else if (isIncrement) {
      setQuantity((prev) => (prev += 1));
    }
    if (isIncrement) {
      setTotalPrice((prev) => prev + (selectedCart.Price as number));
    } else {
      setTotalPrice((prev) => prev - (selectedCart.Price as number));
    }
  };
  const onOpenDelete = (selectedCart: UCart) => {
    setSelectedCart(selectedCart);
    setIsOpenDelete(true);
  };
  const onCloseDelete = () => {
    setIsOpenDelete(false);
  };
  const onChangeClientName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setClientName(value);
  };
  const onChangeShippingAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipAddress({ ...shipAddress, [name]: value });
  };
  const onOpenCheckOut = (selectedCart: UCart) => {
    setSelectedCart(selectedCart);
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns === null) {
        setCheckoutAddOns([]);
        return;
      }
      setCheckoutAddOns(uAddOns);
    };
    getAddOnsFromCart(userId, selectedCart.id, onAddOns);
    setIsOpenCheckout(true);
  };
  const onCloseCheckOut = () => {
    setIsOpenCheckout(false);
    setCheckoutAddOns([]);
    setSelectedCart(EMPTY_CART());
  };
  const onCheckout = () => {
    const [success, message] = validateOrderVM(shipAddress, clientName);
    if (!success) {
      setShipInfoErrText(message);
      return;
    } else {
      setShipInfoErrText("");
    }

    const onSuccessfullyCheckedOut = (success: boolean) => {
      if (success) {
        notify.HandleOpenAlert("success", "Successfully checked out");
      } else {
        notify.HandleOpenAlert("error", "Failed to check out");
      }
    };
    uploadOrderVM(
      selectedCart,
      shipAddress,
      clientName,
      userId,
      onSuccessfullyCheckedOut
    );
    onCloseCheckOut();
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
      const unsubscribeCart = listenCartVM(userId, onCartsVM);
      return () => {
        console.log("[useCartController] Removing cart listener");
        unsubscribeCart();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const alertSnackbar = notify.SnackBar;
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

    clientName,
    onChangeClientName,
    shipAddress,
    onChangeShippingAddress,
    isOpenCheckout,
    onOpenCheckOut,
    onCloseCheckOut,
    shipInfoErrText,
    onCheckout,

    checkoutAddOns,
  };
};

export default useCartController;
