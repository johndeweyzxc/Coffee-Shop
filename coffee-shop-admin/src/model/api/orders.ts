import { initializeApp } from "firebase/app";
import {
  FirestoreError,
  QuerySnapshot,
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

import { FIREBASE_CONFIG } from "../../firebaseConf";
import { COL_ORDERS } from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Listens for any changes of order document in "Orders" collection
 * @param onChange Callback handler when there is an update of any order document in "Orders" collection
 * @returns Unsubscriber function to detach this listener
 */
export const listenOrdersInFirebase = (
  onChange: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_ORDERS));
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

/**
 * Deletes an order document in "Orders" collection
 * @param orderId The UID of the order document that will be deleted
 * @param onDeletedOrder Callback handler when this operation is success or not
 */
export const deleteOrderInFirebase = (
  orderId: string,
  onDeletedOrder: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_ORDERS, orderId))
    .then(() => {
      console.log(
        `orders.deleteOrderInFirebase: Successfully deleted order with id ${orderId}`
      );
      onDeletedOrder(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `orders.deleteOrderInFirebase: There is an error deleting order with id ${orderId}`
        );
        onDeletedOrder(false);
      }
    });
};

/**
 * Sets a new status value for the field "Status" of order document
 * @param orderId The UID of the order document that will be updated
 * @param newOrderStatus The new status value for the field "Status" of order document
 * @param onUpdatedStatusOfOrder  Callback handler when this operation is success or not
 */
export const updateStatusOfOrderInFirebase = (
  orderId: string,
  newOrderStatus: string,
  onUpdatedStatusOfOrder: (success: boolean) => void
) => {
  updateDoc(doc(db, COL_ORDERS, orderId), {
    Status: newOrderStatus,
  })
    .then(() => {
      console.log(
        `orders.updateStatusOfOrderInFirebase: Successfully updated status of order with id ${orderId}`
      );
      onUpdatedStatusOfOrder(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `orders.updateStatusOfOrderInFirebase: There is an error updating status of order with id ${orderId}`
        );
        onUpdatedStatusOfOrder(false);
      }
    });
};
