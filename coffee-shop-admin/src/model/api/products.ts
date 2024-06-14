import { initializeApp } from "firebase/app";
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
  updateDoc,
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

export const uploadProductInFirebase = (
  product: Product,
  cb: (success: boolean, productId: string) => void
) => {
  addDoc(collection(db, COL_PRODUCTS), product)
    .then((value) => {
      console.log(
        `products.uploadProductInFirebase: Successfully uploaded new product with id ${value.id}`
      );
      cb(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `products.uploadProductInFirebase: There is an error uploading new product ${product.Name}`
        );
        cb(false, "");
      }
    });
};

export const updateProductInFirebase = (
  product: Product,
  id: string,
  cb: (success: boolean) => void
) => {
  const productRef = doc(db, COL_PRODUCTS, id);
  updateDoc(productRef, {
    Name: product.Name,
    Description: product.Description,
    Price: product.Price,
  })
    .then(() => {
      console.log(
        `products.updateProductInFirebase: Successfully updated product with id ${id}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `products.updateProductInFirebase: There is an error updating product with id ${id}`
        );
        cb(false);
      }
    });
};

export const deleteProductInFirebase = (
  id: string,
  cb: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_PRODUCTS, id))
    .then(() => {
      console.log(
        `products.deleteProductInFirebase: Successfully deleted product with id ${id}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `products.deleteProductInFirebase: There is an error deleting product with id ${id}`
        );
        cb(false);
      }
    });
};
