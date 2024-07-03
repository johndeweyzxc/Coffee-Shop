import { QuerySnapshot, Unsubscribe } from "firebase/firestore";
import {
  deleteOrderInFirebase,
  listenOrdersInFirebase,
  updateStatusOfOrderInFirebase,
} from "./api/orders";

export interface ShippingAddress {
  Region: string;
  City: string;
  District: string;
  Street: string;
}

export interface ProductOrder {
  Name: string;
  Description: string;
  Price: string | number;
  TotalPrice: string | number;
  ProductId: string;
  Quantity: number;
}

export interface Order {
  ClientName: string;
  ClientUID: string;
  ProductOrderInfo: ProductOrder;
  ShippingAddressLocation: ShippingAddress;
  Status: string;
}

export interface UOrder extends Order {
  id: string;
}

const useOrdersModel = () => {
  const listenOrders = (
    onOrders: (orders: UOrder[] | null) => void
  ): Unsubscribe => {
    const cb = (snapshot: QuerySnapshot | null) => {
      if (snapshot === null) {
        onOrders(null);
        return;
      }

      const orderList: UOrder[] = [];
      snapshot.forEach((doc) => {
        const s = doc.data() as Order;
        const uorder: UOrder = {
          id: doc.id,
          ClientName: s.ClientName,
          ClientUID: s.ClientUID,
          ProductOrderInfo: s.ProductOrderInfo,
          ShippingAddressLocation: s.ShippingAddressLocation,
          Status: s.Status,
        };
        orderList.push(uorder);
      });
      onOrders(orderList);
    };
    return listenOrdersInFirebase(cb);
  };

  const deleteOrder = (
    orderId: string,
    onDeletedOrder: (success: boolean) => void
  ) => {
    deleteOrderInFirebase(orderId, onDeletedOrder);
  };

  const updateStatusOfOrder = (
    orderId: string,
    newOrderStatus: string,
    onUpdatedStatusOfOrder: (success: boolean) => void
  ) => {
    updateStatusOfOrderInFirebase(
      orderId,
      newOrderStatus,
      onUpdatedStatusOfOrder
    );
  };

  return {
    listenOrders,
    deleteOrder,
    updateStatusOfOrder,
  };
};

export default useOrdersModel;
