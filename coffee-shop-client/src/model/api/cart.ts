import { initializeApp } from "firebase/app";
import { COL_USERS, COL_USERS_CARTS } from "../../strings";
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
  updateDoc,
} from "firebase/firestore";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export interface Cart {
  Name: string;
  Description: string;
  Price: string | number;
  TotalPrice: string | number;
  ProductId: string;
  Quantity: number;
}

export interface UCart extends Cart {
  id: string;
  ProductImageURL: string;
}

export const getCartInFirebase = (
  userId: string,
  cb: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_USERS, userId, COL_USERS_CARTS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `carts.getCartInFirebase: Fetched ${snapshot.size} cart data`
      );
      cb(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.getCartInFirebase: There is an error fetching cart data"
      );
      cb(null);
    }
  );
};

export const addToCartInFirebase = (
  userId: string,
  cart: Cart,
  cb: (success: boolean, cartId: string) => void
) => {
  addDoc(collection(db, COL_USERS, userId, COL_USERS_CARTS), cart)
    .then((value) => {
      console.log(
        `carts.addToCartInFirebase: Successfully added product with id ${cart.ProductId} to cart`
      );
      cb(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `carts.addToCartInFirebase: There is an error adding product with id ${cart.ProductId} to cart`
        );
      }
      cb(false, "");
    });
};

export const removeFromCartInFirebase = (
  userId: string,
  cartId: string,
  cb: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_USERS, userId, COL_USERS_CARTS, cartId))
    .then(() => {
      console.log(
        `carts.removeFromCartInFirebase: Successfully deleted cart with id ${cartId}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `carts.removeFromCartInFirebase: There is an error deleting product with id ${cartId}`
        );
      }
      cb(false);
    });
};

export const editCartInFirebase = (
  userId: string,
  cartId: string,
  newCart: object,
  cb: (success: boolean) => void
) => {
  const cartRef = doc(db, COL_USERS, userId, COL_USERS_CARTS, cartId);
  updateDoc(cartRef, newCart)
    .then(() => {
      console.log(
        `carts.editCartInFirebase: Successfully updated cart with id ${cartId}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `carts.editCartInFirebase: There is an error updating cart with id ${cartId}`
        );
      }
      cb(false);
    });
};
