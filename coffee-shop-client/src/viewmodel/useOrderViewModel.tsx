import useAddOnsModel, { UAddOn } from "../model/useAddOnsModel";
import useCartsModel, { UCart } from "../model/useCartsModel";
import useOrderModel, { ShippingAddress } from "../model/useOrderModel";

export const useOrderViewModel = () => {
  const { addOrder } = useOrderModel();
  const { removeFromCart } = useCartsModel();
  const { getAddOnsFromCart, appendAddOnInOrder, removeAddOnInCart } =
    useAddOnsModel();

  const addOrderVM = (
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
    addOrder(uCart, clientName, clientUID, shippingAddr, onAddedOrder);
  };

  return { addOrderVM };
};
