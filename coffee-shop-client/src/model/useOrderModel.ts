import { QuerySnapshot } from "firebase/firestore";
import { listenOrderInFirebase, uploadOrderInFirebase } from "./api/order";
import { UCart } from "./useCartsModel";

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
  ProductImageURL: string;
}

const useOrderModel = () => {
  const uploadOrder = (
    uCart: UCart,
    clientName: string,
    clientUID: string,
    shippingAddr: ShippingAddress,
    cb: (success: boolean, orderId: string) => void
  ) => {
    const productOrder: ProductOrder = {
      Name: uCart.Name,
      Description: uCart.Description,
      Price: uCart.Price,
      ProductId: uCart.ProductId,
      Quantity: uCart.Quantity,
      TotalPrice: uCart.TotalPrice,
    };

    const order: Order = {
      ClientName: clientName,
      ClientUID: clientUID,
      ProductOrderInfo: productOrder,
      ShippingAddressLocation: shippingAddr,
      Status: "Order requested",
    };

    uploadOrderInFirebase(order, cb);
  };

  const listenOrders = (
    clientUID: string,
    onOrders: (orders: UOrder[] | null) => void
  ) => {
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
          ProductImageURL: "",
          ProductOrderInfo: s.ProductOrderInfo,
          ShippingAddressLocation: s.ShippingAddressLocation,
          Status: s.Status,
        };
        orderList.push(uorder);
      });
      onOrders(orderList);
    };
    return listenOrderInFirebase(clientUID, cb);
  };

  return { listenOrders, uploadOrder };
};

export default useOrderModel;
