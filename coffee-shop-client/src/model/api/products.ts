import { initializeApp } from "firebase/app";
import {
  FirestoreError,
  QuerySnapshot,
  Unsubscribe,
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { COL_PRODUCTS, FIRESTORE_PERMISSION_ERROR } from "../../strings";
import { PRODUCTS_STATUS } from "../../status";
import { FIREBASE_CONFIG } from "../../firebaseConf";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export interface Product {
  Name: string;
  Description: string;
  Price: number | string;
}

export interface UProduct extends Product {
  id: string;
}

export const getProductsInFirebase = (
  cb: (snapshot: QuerySnapshot | null, status: PRODUCTS_STATUS) => void
): Unsubscribe => {
  const q = query(collection(db, COL_PRODUCTS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `products.getProductsInFirebase: Fetched ${snapshot.size} product data`
      );
      cb(snapshot, PRODUCTS_STATUS.FETCHED);
    },
    (error: FirestoreError) => {
      console.log(
        "products.getProductsInFirebase: There is an error fetching product data, ",
        error.message
      );
      if (error.message === FIRESTORE_PERMISSION_ERROR) {
        cb(null, PRODUCTS_STATUS.PERMISSION_ERROR);
      } else {
        cb(null, PRODUCTS_STATUS.ERROR);
      }
    }
  );
};
