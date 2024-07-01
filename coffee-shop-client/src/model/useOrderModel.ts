import { Order, addOrderInFirebase } from "./api/order";

const useOrderModel = () => {
  const addOrder = (
    order: Order,
    cb: (success: boolean, orderId: string) => void
  ) => {
    addOrderInFirebase(order, cb);
  };

  return { addOrder };
};

export default useOrderModel;
