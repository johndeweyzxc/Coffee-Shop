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
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { FIREBASE_CONFIG } from "../../firebaseConf";
import { PRODUCTS_STATUS } from "../../status";
import {
  COL_PRODUCTS,
  FIRESTORE_PERMISSION_ERROR,
  STORAGE_PRODUCTS,
} from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Listens for any changes of product document in "Products" collection
 * @param onChange Callback handler when there is an update of any product document in "Products" collection
 * @returns Unsubscriber function to detach this listener
 */
export const listenProductInFirebase = (
  onChange: (snapshot: QuerySnapshot | null, status: PRODUCTS_STATUS) => void
): Unsubscribe => {
  const q = query(collection(db, COL_PRODUCTS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `products.listenProductInFirebase: Fetched ${snapshot.size} product data`
      );
      onChange(snapshot, PRODUCTS_STATUS.FETCHED);
    },
    (error: FirestoreError) => {
      console.log(
        "products.listenProductInFirebase: There is an error fetching product data, ",
        error.message
      );
      if (error.message === FIRESTORE_PERMISSION_ERROR) {
        onChange(null, PRODUCTS_STATUS.PERMISSION_ERROR);
      } else {
        onChange(null, PRODUCTS_STATUS.ERROR);
      }
    }
  );
};

/**
 * Gets the image URL of a product document if it exists in Firebase storage
 * @param productId The UID of a product document
 * @param onGotImageURL Callback handler when the URL is found
 */
export const getProductImageURLInFirebase = (
  productId: string,
  onGotImageURL: (url: string) => void
) => {
  const storage = getStorage(app);
  const imgRef = ref(storage, `${STORAGE_PRODUCTS}/${productId}`);

  getDownloadURL(imgRef)
    .then((url) => {
      onGotImageURL(url);
    })
    .catch(() => {
      onGotImageURL("");
    });
};
