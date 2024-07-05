import { initializeApp } from "firebase/app";
import {
  FirestoreError,
  QuerySnapshot,
  Unsubscribe,
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { FIREBASE_CONFIG } from "../../firebaseConf";
import { COL_ORDERS } from "../../strings";
import { Order } from "../useOrderModel";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
if (window.location.hostname === "localhost") {
  console.log(
    "[products] Application using firestore running in development mode"
  );
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

/**
 * Uploads an order document in "Order" collection
 * @param order The order document that will be uploaded
 * @param onUploadedOrder Callback handler when this operation is success or not
 */
export const uploadOrderInFirebase = (
  order: Order,
  onUploadedOrder: (success: boolean, orderId: string) => void
) => {
  addDoc(collection(db, COL_ORDERS), order)
    .then((value) => {
      console.log(
        `order.uploadOrderInFirebase: Successfully added order where id is ${value.id}`
      );
      onUploadedOrder(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `order.uploadOrderInFirebase: There is an error adding order where product id is ${order.ProductOrderInfo.ProductId}`
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

/**
 * Listens for any changes of order document owned by user based on "ClientUID" field in "Orders" collection.
 * @param clientUID The UID of the currently signed in user
 * @param onChange Callback handler when there is an update of order document in owned by user based on "ClientUID" field in "Orders" collection
 */
export const listenOrderInFirebase = (
  clientUID: string,
  onChange: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(
    collection(db, COL_ORDERS),
    where("ClientUID", "==", clientUID)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `orders.listenOrdersInFirebase: Fetched ${snapshot.size} order data`
      );
      onChange(snapshot);
    },
    (error: FirestoreError) => {
      console.log(
        "orders.listenOrdersInFirebase: There is an error fetching order data",
        error.message
      );
      onChange(null);
    }
  );
};
