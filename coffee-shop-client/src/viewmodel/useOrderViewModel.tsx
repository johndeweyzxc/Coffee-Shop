import { Unsubscribe } from "firebase/firestore";
import useAddOnsModel, { UAddOn } from "../model/useAddOnsModel";
import useCartsModel, { UCart } from "../model/useCartsModel";
import useOrderModel, { ShippingAddress, UOrder } from "../model/useOrderModel";
import useProductsModel from "../model/useProductsModel";

export const useOrderViewModel = () => {
  const { getProductImageURL } = useProductsModel();
  const { listenOrders, uploadOrder } = useOrderModel();
  const { removeFromCart } = useCartsModel();
  const {
    getAddOnsFromCart,
    getAddOnsFromOrder,
    appendAddOnInOrder,
    removeAddOnInCart,
  } = useAddOnsModel();

  const listenOrdersVM = (
    clientUID: string,
    onOrders: (uOrders: UOrder[] | null) => void
  ): Unsubscribe => {
    let listUOrderVM: UOrder[] = [];
    let totalOrders: number | undefined = 0;
    let ordersProcessed = 0;

    const createOrderVM = (uOrder: UOrder) => {
      const onGotProductImageUrl = (url: string) => {
        const newUOrderVM: UOrder = { ...uOrder, ProductImageURL: url };
        listUOrderVM = [...listUOrderVM, newUOrderVM];
        ordersProcessed++;

        if (totalOrders === ordersProcessed) {
          onOrders(listUOrderVM);
          ordersProcessed = 0;
        }
      };
      getProductImageURL(
        uOrder.ProductOrderInfo.ProductId,
        onGotProductImageUrl
      );
    };

    const onReceivedOrders = (orders: UOrder[] | null) => {
      totalOrders = orders?.length;
      listUOrderVM = [];
      orders?.forEach((uOrder) => createOrderVM(uOrder));
    };
    return listenOrders(clientUID, onReceivedOrders);
  };

  const uploadOrderVM = (
    uCart: UCart,
    shippingAddr: ShippingAddress,
    clientName: string,
    clientUID: string,
    cb: (success: boolean) => void
  ) => {
    const appendAddOnInOrderCollection = (orderId: string) => {
      const onRemovedCart = (removeSuccess: boolean) => {
        if (removeSuccess) {
          cb(true);
        } else {
          cb(false);
        }
      };

      const onAddOns = (uAddOns: UAddOn[] | null) => {
        if (uAddOns?.length === 0) {
          // * EMPTY ADDON
          removeFromCart(clientUID, uCart.id, onRemovedCart);
          return;
        }

        uAddOns?.forEach((uAddOn, index) => {
          const onRemovedAddOn = (success: boolean) => {
            if (success) {
              if (uAddOns.length === index + 1) {
                // * LAST ADDON
                // * Delete the cart
                removeFromCart(clientUID, uCart.id, onRemovedCart);
              }
            } else {
              cb(false);
            }
          };
          const onAppendedAddOn = (success: boolean) => {
            if (success) {
              removeAddOnInCart(clientUID, uCart.id, uAddOn.id, onRemovedAddOn);
            } else {
              cb(false);
            }
          };
          appendAddOnInOrder(orderId, uAddOn, onAppendedAddOn);
        });
      };
      getAddOnsFromCart(clientUID, uCart.id, onAddOns);
    };

    const onAddedOrder = (success: boolean, orderId: string) => {
      if (success) {
        // * Copy all the addons from cart into the order
        // * Then upon successful copy of addons, delete the cart
        appendAddOnInOrderCollection(orderId);
      } else {
        cb(false);
      }
    };
    uploadOrder(uCart, clientName, clientUID, shippingAddr, onAddedOrder);
  };

  return { listenOrdersVM, uploadOrderVM, getAddOnsFromOrder };
};
