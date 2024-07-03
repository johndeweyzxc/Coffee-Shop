import { addOrderInFirebase } from "./api/order";
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
  const addOrder = (
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

    addOrderInFirebase(order, cb);
  };

  return { addOrder };
};

export default useOrderModel;
