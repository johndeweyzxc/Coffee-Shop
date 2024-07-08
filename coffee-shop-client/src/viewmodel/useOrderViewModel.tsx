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
      if (totalOrders === 0) {
        onOrders([]);
      } else {
        orders?.forEach((uOrder) => createOrderVM(uOrder));
      }
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
    let uAddOnList: UAddOn[] = [];

    const appendAddOnInOrderCollection = (orderId: string) => {
      const onRemovedCart = (removeSuccess: boolean) => {
        if (removeSuccess) {
          // * 6. Notify user about successful operation
          cb(true);
        } else {
          cb(false);
        }
      };

      if (uAddOnList.length === 0) {
        removeFromCart(clientUID, uCart.id, onRemovedCart);
      }

      uAddOnList?.forEach((uAddOn, index) => {
        const onRemovedAddOn = (success: boolean) => {
          if (success) {
            if (uAddOnList.length === index + 1) {
              // * 5. On successful deletion of last AddOn document, delete the Cart document
              removeFromCart(clientUID, uCart.id, onRemovedCart);
            }
          } else {
            cb(false);
          }
        };
        const onAppendedAddOn = (success: boolean) => {
          if (success) {
            // * 4. On successful copy of a single AddOn document, delete it from Cart
            removeAddOnInCart(clientUID, uCart.id, uAddOn.id, onRemovedAddOn);
          } else {
            cb(false);
          }
        };

        // * 3. Copy each AddOn document from Cart into Order
        appendAddOnInOrder(orderId, uCart.ProductId, uAddOn, onAppendedAddOn);
      });
    };

    const onAddedOrder = (success: boolean, orderId: string) => {
      if (success) {
        appendAddOnInOrderCollection(orderId);
      } else {
        cb(false);
      }
    };

    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns !== null) uAddOnList = uAddOns;
      // * 2. Upload order by copying product info from cart into order
      uploadOrder(
        uCart,
        uAddOnList,
        clientName,
        clientUID,
        shippingAddr,
        onAddedOrder
      );
    };

    // * 1. Fetched all AddOn document from Cart
    getAddOnsFromCart(clientUID, uCart.id, onAddOns);
  };

  return { listenOrdersVM, uploadOrderVM, getAddOnsFromOrder };
};
