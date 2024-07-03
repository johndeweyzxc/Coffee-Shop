import { initializeApp } from "firebase/app";
import {
  FirestoreError,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";

import { AddOn } from "../useAddOnsModel";
import { FIREBASE_CONFIG } from "../../firebaseConf";
import {
  COL_ADDONS,
  COL_ORDERS,
  COL_PRODUCTS,
  COL_USERS,
  COL_USERS_CARTS,
} from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Listens for any changes of AddOn document in "AddOns" collection in product document
 * @param productId The UID of the product document
 * @param onChange Callback handler when there is an update in "AddOns" collection
 * @returns Unsubscriber function to detach this listener
 */
export const listenAddOnsFromProductInFirebase = (
  productId: string,
  onChange: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_PRODUCTS, productId, COL_ADDONS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `carts.listenAddOnsFromProductInFirebase: Fetched ${snapshot.size} addon data`
      );
      onChange(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.listenAddOnsFromProductInFirebase: There is an error fetching addon data"
      );
      onChange(null);
    }
  );
};

/**
 * Listens for any changes of AddOn document in "AddOns" collection in cart document. AddOns are copied from product document into cart document when a product is added to cart.
 * @param userId The UID of currently logged in user
 * @param cartId The UID of the cart document
 * @param onChange Callback handler when there is an update of AddOn in "AddOns" collection
 * @returns Unsubscriber function to detach this listener
 */
export const listenAddOnsFromCartInFirebase = (
  userId: string,
  cartId: string,
  onChange: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(
    collection(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `carts.listenAddOnsFromCartInFirebase: Fetched ${snapshot.size} addon data`
      );
      onChange(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.listenAddOnsFromCartInFirebase: There is an error fetching addon data"
      );
      onChange(null);
    }
  );
};

/**
 * Gets all the AddOn document from "AddOns" collection in cart document
 * @param userId The UID of currently logged in user
 * @param cartId The UID of the cart document
 * @param onGotAddOns Callback handler when the data arrives
 */
export const getAddOnsFromCartInFirebase = (
  userId: string,
  cartId: string,
  onGotAddOns: (snapshot: QueryDocumentSnapshot[] | null) => void
) => {
  const q = query(
    collection(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS)
  );
  getDocs(q)
    .then((value) => {
      console.log(
        `carts.getAddOnsFromCartInFirebase: Fetched ${value.size} addon data`
      );
      onGotAddOns(value.docs);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          "carts.getAddOnsFromCartInFirebase: There is an error fetching addon data"
        );
      }
      onGotAddOns(null);
    });
};

/**
 * Uploads an AddOn document to "AddOns" collection in Cart document
 * @param userId The UID of the currently logged in user
 * @param cartId The UID of cart document
 * @param addOn The AddOn that will be uploaded into "AddOns" collection
 * @param onUploadedAddOn Callback handler when this operation is success or not
 */
export const appendAddOnInCartInFirebase = (
  userId: string,
  cartId: string,
  addOn: AddOn,
  onUploadedAddOn: (success: boolean) => void
) => {
  addDoc(
    collection(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS),
    addOn
  )
    .then((value) => {
      console.log(
        `addOns.appendAddOnInCartInFirebase: Successfully added addon with id ${value.id} in addons for cart with id ${cartId}`
      );
      onUploadedAddOn(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.appendAddOnInCartInFirebase: There is an error adding addon with name ${addOn.Name} in addons for cart with id ${cartId}`
        );
      }
      onUploadedAddOn(false);
    });
};

/**
 * Removes an AddOn document from "AddOns" collection in cart document
 * @param userId The UID of the currently logged in user
 * @param cartId The UID of cart document
 * @param addOnId The UID of addon document
 * @param onRemovedAddOn Callback handler when this operation is success or not
 */
export const removeAddOnFromCartInFirebase = (
  userId: string,
  cartId: string,
  addOnId: string,
  onRemovedAddOn: (success: boolean) => void
) => {
  deleteDoc(
    doc(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS, addOnId)
  )
    .then(() => {
      console.log(
        `addOns.removeAddOnFromCartInFirebase: Successfully deleted addon from user with id ${userId} from cart with id ${cartId}`
      );
      onRemovedAddOn(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.removeAddOnFromCartInFirebase: There is an error deleting addon from user with id ${userId} from cart with id ${cartId}`
        );
      }
      onRemovedAddOn(false);
    });
};

/**
 * Uploads an AddOn document to "AddOns" collection in Order document
 * @param orderId The UID of order document
 * @param addOn The AddOn that will be uploaded into "AddOns" collection
 * @param onAppendedAddOn Callback handler when this operation is success or not
 */
export const appendAddOnInOrderInFirebase = (
  orderId: string,
  addOn: AddOn,
  onAppendedAddOn: (success: boolean) => void
) => {
  addDoc(collection(db, COL_ORDERS, orderId, COL_ADDONS), addOn)
    .then(() => {
      console.log(
        `addons.appendAddOnInOrderInFirebase: Successfully appended addon to order where order id is ${orderId}`
      );
      onAppendedAddOn(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addons.appendAddOnInOrderInFirebase: There is an error adding addon to order where order id is ${orderId}`
        );
      }
      onAppendedAddOn(false);
    });
};
