import { GridColDef, GridEventListener } from "@mui/x-data-grid";
import { UOrder } from "../../model/useOrdersModel";
import { useState } from "react";
import { UAddOn } from "../../model/useAddOnsModel";

export const useOrder = (
  isLoggedIn: boolean,
  handleOpenAlert: (severity: string, message: string) => void
) => {
  const EMPTY_ORDER = () => {
    return {
      id: "",
      ClientName: "",
      ClientUID: "",
      ProductOrderInfo: {
        Description: "",
        Name: "",
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
      headerName: "Client Name",
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
  ];

  // * STATE MANAGEMENT FOR ORDERS
  // Orders published
  const [orders, setOrders] = useState<UOrder[]>([]);
  // Use in dialog when an order is clicked from the table
  const [isOpenStatusUpdater, setIsOpenStatusUpdater] =
    useState<boolean>(false);
  // The current order that is selected from the table
  const [currentOrder, setCurrentOrder] = useState<UOrder>(EMPTY_ORDER());
  // The selected addons of a selected order from the table
  const [currAddOns, setCurrAddOns] = useState<UAddOn[]>([]);

  const onOrderClicked: GridEventListener<"rowClick"> = (params) => {
    // TODO: Implementation
  };
};
