import { AddOn, UAddOn } from "../model/api/addons";
import { UCart } from "../model/api/cart";
import { Order, ProductOrder, ShippingAddress } from "../model/api/order";
import useAddOnsModel from "../model/useAddOnsModel";
import useCartsModel from "../model/useCartsModel";
import useOrderModel from "../model/useOrderModel";

export const useOrderViewModel = () => {
  const { addOrder } = useOrderModel();
  const { removeFromCart } = useCartsModel();
  const { getAddOnsInCart, appendAddOnInOrder, removeAddOnInCart } =
    useAddOnsModel();

  const addOrderVM = (
    cart: UCart,
    shippingAddr: ShippingAddress,
    clientName: string,
    clientUID: string,
    cb: (success: boolean) => void
  ) => {
    const productOrder: ProductOrder = {
      Name: cart.Name,
      Description: cart.Description,
      Price: cart.Price,
      ProductId: cart.ProductId,
      Quantity: cart.Quantity,
      TotalPrice: cart.TotalPrice,
    };

    const newOrder: Order = {
      ClientName: clientName,
      ClientUID: clientUID,
      ProductOrderInfo: productOrder,
      ShippingAddressLocation: shippingAddr,
      Status: "Order requested",
    };

    const appendAddOnInOrderCollection = (orderId: string) => {
      const onRemovedCart = (removeSuccess: boolean) => {
        if (removeSuccess) {
          cb(true);
        } else {
          cb(false);
        }
      };

      const onAddOns = (uAddOns: UAddOn[] | null) => {
        uAddOns?.forEach((uAddOn, index) => {
          const onRemovedAddOn = (success: boolean) => {
            if (success) {
              if (uAddOns.length === index + 1) {
                // * LAST ADDON
                // * Delete the cart
                removeFromCart(clientUID, cart.id, onRemovedCart);
              }
            } else {
              cb(false);
            }
          };
          const onAppendedAddOn = (success: boolean) => {
            if (success) {
              removeAddOnInCart(clientUID, cart.id, uAddOn.id, onRemovedAddOn);
            } else {
              cb(false);
            }
          };
          // TODO: Fix addon to not include "id"
          appendAddOnInOrder(orderId, uAddOn as AddOn, onAppendedAddOn);
        });
      };
      getAddOnsInCart(clientUID, cart.id, onAddOns);
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
    addOrder(newOrder, onAddedOrder);
  };

  return { addOrderVM };
};
