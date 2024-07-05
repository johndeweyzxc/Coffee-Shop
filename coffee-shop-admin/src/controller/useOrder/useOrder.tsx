import { GridColDef, GridEventListener } from "@mui/x-data-grid";
import { ChangeEvent, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/firestore";

import { UOrder } from "../../model/useOrdersModel";
import { UAddOn } from "../../model/useAddOnsModel";
import useAdminViewModel from "../../viewmodel/useAdminViewModel";

export const useOrder = (
  isLoggedIn: boolean,
  handleOpenAlert: (severity: string, message: string) => void
) => {
  const EMPTY_ORDER = () => {
    return {
      id: "",
      ClientName: "",
      ClientUID: "",

      Name: "",
      Description: "",
      Price: 0,
      ProductId: "",
      Quantity: 0,
      TotalPrice: 0,

      City: "",
      District: "",
      Region: "",
      Street: "",

      Status: "",
    };
  };

  const orderCol: GridColDef<(typeof orders)[number]>[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "ClientName",
      headerName: "Client name",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "ClientUID",
      headerName: "Client UID",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "TotalPrice",
      headerName: "Total price",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Street",
      headerName: "Street",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "District",
      headerName: "District",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "City",
      headerName: "City",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Region",
      headerName: "Region",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
  ];

  const {
    listenOrders,
    getAddOnsFromOrder,
    deleteOrder,
    updateStatusOfOrder,
    onChangeStatusIsValid,
  } = useAdminViewModel();

  // * STATE MANAGEMENT FOR ORDERS
  // Orders published
  const [orders, setOrders] = useState<UOrder[]>([]);
  // Use in dialog when an order is clicked from the table
  const [isOpenOrderDialog, setIsOpenOrderDialog] = useState<boolean>(false);
  // The current order that is selected from the table
  const [currentOrder, setCurrentOrder] = useState<UOrder>(EMPTY_ORDER());
  // The selected addons of a selected order from the table
  const [currAddOns, setCurrAddOns] = useState<UAddOn[]>([]);
  // The current status of the order, this changes based on user input
  const [currStatus, setCurrStatus] = useState<string>("");
  // The current status of the order, this does not change
  const [oldCurrStatus, setOldCurrStatus] = useState<string>("");
  // The boolean value depends if the current status value is valid or not
  const [isStatusValid, setIsStatusValid] = useState<boolean>(false);

  const onUpdateStatus = () => {
    const onUpdatedStatus = (success: boolean) => {
      if (!success) {
        handleOpenAlert("error", "Error updating status");
      }
    };
    updateStatusOfOrder(currentOrder.id, currStatus, onUpdatedStatus);
  };
  const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrStatus(value);
  };
  useEffect(() => {
    setIsStatusValid(onChangeStatusIsValid(currStatus, oldCurrStatus));
  }, [currStatus]);
  const onCloseOrderDialog = () => {
    setIsOpenOrderDialog(false);
    setCurrStatus("");
    setOldCurrStatus("");
    setCurrentOrder(EMPTY_ORDER());
    setCurrAddOns([]);
  };
  const onDeleteOrder = () => {
    const onDeletedOrder = (success: boolean) => {
      if (!success) {
        handleOpenAlert("error", "Error deleting order");
      }
      onCloseOrderDialog();
    };
    deleteOrder(currentOrder.id, onDeletedOrder);
  };
  const onOrderClicked: GridEventListener<"rowClick"> = (params) => {
    setCurrentOrder(params.row);
    setIsOpenOrderDialog(true);
  };
  useEffect(() => {
    if (isOpenOrderDialog) {
      setCurrStatus(currentOrder.Status);
      setOldCurrStatus(currentOrder.Status);
      const onGotAddOns = (uAddOns: UAddOn[] | null) => {
        if (uAddOns === null) {
          handleOpenAlert("error", "Error getting addons");
        } else {
          setCurrAddOns(uAddOns);
        }
      };
      getAddOnsFromOrder(currentOrder.id, onGotAddOns);
    }
  }, [isOpenOrderDialog]);
  useEffect(() => {
    let unsubsribeOrder: Unsubscribe | null = null;
    const onOrders = (orders: UOrder[] | null) => {
      if (orders === null) {
        handleOpenAlert("error", "Failed to fetched order data");
      } else {
        setOrders(orders);
      }
    };
    if (isLoggedIn) {
      console.log("[useOrderController] Adding order listener");
      unsubsribeOrder = listenOrders(onOrders);
    } else {
      setOrders([]);
    }
    return () => {
      console.log("[useOrderController] Removing order listener");
      if (unsubsribeOrder !== null) unsubsribeOrder();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return {
    isOpenOrderDialog,
    onCloseOrderDialog,

    orders,
    orderCol,
    onOrderClicked,
    onDeleteOrder,

    currentOrder,
    currAddOns,

    onChangeStatus,
    currStatus,
    onUpdateStatus,
    isStatusValid,
  };
};
