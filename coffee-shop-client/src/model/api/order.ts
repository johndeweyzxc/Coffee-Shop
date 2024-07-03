import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";

import { FIREBASE_CONFIG } from "../../firebaseConf";
import { COL_ORDERS } from "../../strings";
import { Order } from "../useOrderModel";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Uploads an order document in "Order" collection
 * @param order The order document that will be uploaded
 * @param onUploadedOrder Callback handler when this operation is success or not
 */
export const addOrderInFirebase = (
  order: Order,
  onUploadedOrder: (success: boolean, orderId: string) => void
) => {
  addDoc(collection(db, COL_ORDERS), order)
    .then((value) => {
      console.log(
        `order.addOrderInFirebase: Successfully added order where id is ${value.id}`
      );
      onUploadedOrder(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `order.addOrderInFirebase: There is an error adding order where product id is ${order.ProductOrderInfo.ProductId}`
        );
        onUploadedOrder(false, "");
      }
    });
};

/**
 * Deletes an order document from "Orders" collection
 * @param orderId The UID of the order document
 * @param onDeletedOrder Callback handler when this operation is success or not
 */
export const deleteOrderInFirebase = (
  orderId: string,
  onDeletedOrder: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_ORDERS, orderId))
    .then(() => {
      console.log(
        `order.deleteOrderInFirebase: Successfully deleted order with id ${orderId}`
      );
      onDeletedOrder(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `order.deleteOrderInFirebase: There is an error deleting order with id ${orderId}`
        );
      }
      onDeletedOrder(false);
    });
};
