import { useEffect, useState } from "react";

import { UOrder } from "../model/useOrderModel";
import { UAddOn } from "../model/useAddOnsModel";
import { useOrderViewModel } from "../viewmodel/useOrderViewModel";
import Notification from "../components/Notification";

const useOrderController = (userId: string) => {
  const EMPTY_ORDER = () => {
    return {
      id: "",
      ProductImageURL: "",
      ClientName: "",
      ClientUID: "",
      ProductOrderInfo: {
        Name: "",
        Description: "",
        Price: 0,
        ProductId: "",
        Quantity: 0,
        TotalPrice: 0,
      },
      ShippingAddressLocation: {
        City: "",
        District: "",
        Region: "",
        Street: "",
      },
      Status: "",
    };
  };

  const notify = Notification();
  const { listenOrdersVM, getAddOnsFromOrder } = useOrderViewModel();

  // * STATE MANAGEMENT FOR ORDERS
  // List of ordered products
  const [orders, setOrders] = useState<UOrder[]>([]);
  // Use in dialog to show more information about an order
  const [isOpenOrderDialog, setIsOpenOrderDialog] = useState<boolean>(false);
  // The current order that is selected
  const [currentOrder, setCurrentOrder] = useState<UOrder>(EMPTY_ORDER());
  // The selected addons of a current order
  const [currAddOns, setCurrAddOns] = useState<UAddOn[]>([]);

  const onCloseOrderDialog = () => {
    setIsOpenOrderDialog(false);
    setCurrentOrder(EMPTY_ORDER());
    setCurrAddOns([]);
  };
  const onOrderClicked = (uOrder: UOrder) => {
    setCurrentOrder(uOrder);
    setIsOpenOrderDialog(true);
  };
  useEffect(() => {
    if (isOpenOrderDialog) {
      const onGotAddOns = (uAddOns: UAddOn[] | null) => {
        if (uAddOns === null) {
          notify.HandleOpenAlert("error", "Error getting addons");
        } else {
          setCurrAddOns(uAddOns);
        }
      };
      getAddOnsFromOrder(currentOrder.id, onGotAddOns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenOrderDialog]);
  useEffect(() => {
    const onOrders = (uOrders: UOrder[] | null) => {
      if (uOrders === null) {
        notify.HandleOpenAlert("error", "Failed to fetched order data");
        return;
      }
      setOrders(uOrders);
    };
    if (userId !== "") {
      console.log("[useOrderController] Adding order listener");
      const unsubscribeOrder = listenOrdersVM(userId, onOrders);
      return () => {
        console.log("[useOrderController] Removing order listener");
        unsubscribeOrder();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const snackbar = notify.SnackBar;

  return {
    snackbar,

    orders,
    currentOrder,
    onOrderClicked,
    isOpenOrderDialog,
    onCloseOrderDialog,
    currAddOns,
  };
};

export default useOrderController;
