import { initializeApp } from "firebase/app";
import {
  FirestoreError,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Unsubscribe,
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";

import { AddOn } from "../useAddOnsModel";
import { FIREBASE_CONFIG, IS_DEV_MODE } from "../../FirebaseConfig";
import { COL_ADDONS, COL_ORDERS, COL_PRODUCTS } from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
if (IS_DEV_MODE) {
  console.log(
    "[addons] Application using firestore running in development mode"
  );
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

/**
 * Listens for any changes of AddOn document in "AddOns" collection in a product document
 * @param productId The UID of the product document
 * @param onChange Callback handler when there is an update of any AddOn document in "AddOns" collection
 * @returns Unsubscriber function to detach this listener
 */
export const listenAddOnsInFirebase = (
  productId: string,
  onChange: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_PRODUCTS, productId, COL_ADDONS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `addOns.listenAddOnsInFirebase: Fetched ${snapshot.size} addon data`
      );
      onChange(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "addOns.listenAddOnsInFirebase: There is an error fetching addon data"
      );
      onChange(null);
    }
  );
};

/**
 * Gets all the AddOn document from "AddOns" collection in product document
 * @param productId The UID of the product document
 * @param onGotAddOns Callback handler when the data arrives
 */
export const getAddOnsInFirebase = (
  productId: string,
  onGotAddOns: (snapshot: QueryDocumentSnapshot[] | null) => void
) => {
  const q = query(collection(db, COL_PRODUCTS, productId, COL_ADDONS));
  getDocs(q)
    .then((value) => {
      console.log(
        `addons.getAddOnsInFirebase: Fetched ${value.size} addon data`
      );
      onGotAddOns(value.docs);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          "addons.getAddOnsInFirebase: There is an error fetching addon data"
        );
      }
      onGotAddOns(null);
    });
};

/**
 * Gets all the AddOn document from "AddOns" collection in order document
 * @param orderId The UID of the order document
 * @param onGotAddOns Callback handler when the data arrives
 */
export const getAddOnsFromOrderInFirebase = (
  orderId: string,
  onGotAddOns: (snapshot: QueryDocumentSnapshot[] | null) => void
) => {
  getDocs(query(collection(db, COL_ORDERS, orderId, COL_ADDONS)))
    .then((value) => {
      console.log(
        `addOns.getAddOnsFromOrderInFirebase: Fetched ${value.size} addon data`
      );
      onGotAddOns(value.docs);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          "addOns.getAddOnsFromOrderInFirebase: There is an error fetching addon data"
        );
      }
      onGotAddOns(null);
    });
};

/**
 * Uploads an AddOn product document in "AddOns" collection in product document
 * @param productId The UID of the product document
 * @param addOn The addon that will be uploaded
 * @param onUploadedAddOn Callback handler when this operation is success or not
 */
export const uploadAddOnInFirebase = (
  productId: string,
  addOn: AddOn,
  onUploadedAddOn: (success: boolean, addOnId: string | null) => void
) => {
  addDoc(collection(db, COL_PRODUCTS, productId, COL_ADDONS), addOn)
    .then((value) => {
      console.log(
        `addOns.uploadAddOnInFirebase: Successfully added addon with name ${addOn.Name} in addons for product with id ${productId}`
      );
      onUploadedAddOn(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.uploadAddOnInFirebase: There is an error adding product with name ${addOn.Name} in addons for product with id ${productId}`
        );
        onUploadedAddOn(false, null);
      }
    });
};

/**
 * Deletes an AddOn document in "AddOns" collection in product document
 * @param productId The UID of the product document
 * @param addOnId The UID of the addon document
 * @param onRemovedAddOn Callback handler when this operation is success or not
 */
export const deleteAddOnInFirebase = (
  productId: string,
  addOnId: string,
  onRemovedAddOn: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_PRODUCTS, productId, COL_ADDONS, addOnId))
    .then(() => {
      console.log(
        `addOns.deleteAddOnInFirebase: Successfully deleted addon with id ${addOnId} from product with id ${productId}`
      );
      onRemovedAddOn(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.deleteAddOnInFirebase: There is an error deleting addon with id ${addOnId} from product with id ${productId}`
        );
        onRemovedAddOn(false);
      }
    });
};
