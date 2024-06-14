import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../../firebaseConf";
import {
  FirestoreError,
  QuerySnapshot,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { COL_ADDONS, COL_PRODUCTS } from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export interface AddOn {
  Name: string;
  Price: string | number;
}

export interface UAddOn extends AddOn {
  id: string;
}

export const getAddOnsInFirebase = (
  productId: string,
  cb: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_PRODUCTS, productId, COL_ADDONS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `carts.getAddOnsInFirebase: Fetched ${snapshot.size} addon data`
      );
      cb(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.getAddOnsInFirebase: There is an error fetching addon data"
      );
      cb(null);
    }
  );
};

export const addAddOnInFirebase = (
  productId: string,
  addOn: AddOn,
  cb: (success: boolean, addOnId: string | null) => void
) => {
  addDoc(collection(db, COL_PRODUCTS, productId, COL_ADDONS), addOn)
    .then((value) => {
      console.log(
        `addOns.addAddOnInFirebase: Successfully added addon with name ${addOn.Name} in addons for product with id ${productId}`
      );
      cb(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.addAddOnInFirebase: There is an error adding product with name ${addOn.Name} in addons for product with id ${productId}`
        );
        cb(false, null);
      }
    });
};

export const removeAddOnInFirebase = (
  productId: string,
  addOnId: string,
  cb: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_PRODUCTS, productId, COL_ADDONS, addOnId))
    .then(() => {
      console.log(
        `addOns.removeAddOnInFirebase: Successfully deleted addon with id ${addOnId} from product with id ${productId}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.removeAddOnInFirebase: There is an error deleting addon with id ${addOnId} from product with id ${productId}`
        );
        cb(false);
      }
    });
};
