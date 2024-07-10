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
  updateDoc,
} from "firebase/firestore";

import { Cart } from "../useCartsModel";
import { FIREBASE_CONFIG } from "../../FirebaseConfig";
import { COL_USERS, COL_USERS_CARTS } from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
if (window.location.hostname === "localhost") {
  console.log(
    "[carts] Application using firestore running in development mode"
  );
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

/**
 * Listens for any changes of cart document in "Carts" collection
 * @param userId The UID of currently signed in user
 * @param onChange Callback handler when there is an update in "Carts" collection
 * @returns Unsubscriber function to detach this listener
 */
export const listenCartInFirebase = (
  userId: string,
  onChange: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_USERS, userId, COL_USERS_CARTS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `carts.listenCartInFirebase: Fetched ${snapshot.size} cart data`
      );
      onChange(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.listenCartInFirebase: There is an error fetching cart data"
      );
      onChange(null);
    }
  );
};

/**
 * Uploads a cart document to "Carts" collection
 * @param userId The UID of currently signed in user
 * @param cart The cart that will be uploaded into "Carts" collection
 * @param onAddedToCart Callback handler when this operation is success or not
 */
export const addToCartInFirebase = (
  userId: string,
  cart: Cart,
  onAddedToCart: (success: boolean, cartId: string) => void
) => {
  addDoc(collection(db, COL_USERS, userId, COL_USERS_CARTS), cart)
    .then((value) => {
      console.log(
        `carts.addToCartInFirebase: Successfully added product with id ${cart.ProductId} to cart`
      );
      onAddedToCart(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `carts.addToCartInFirebase: There is an error adding product with id ${cart.ProductId} to cart`
        );
      }
      onAddedToCart(false, "");
    });
};

/**
 * Deletes a cart document in "Carts" collection
 * @param userId The UID of currently signed in user
 * @param cartId The UID of the cart document that will be deleted
 * @param onRemovedFromCart Callback handler when this operation is success or not
 */
export const removeFromCartInFirebase = (
  userId: string,
  cartId: string,
  onRemovedFromCart: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_USERS, userId, COL_USERS_CARTS, cartId))
    .then(() => {
      console.log(
        `carts.removeFromCartInFirebase: Successfully deleted cart with id ${cartId}`
      );
      onRemovedFromCart(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `carts.removeFromCartInFirebase: There is an error deleting product with id ${cartId}`
        );
      }
      onRemovedFromCart(false);
    });
};

/**
 * Updates or edit the content of cart document in "Carts" collection
 * @param userId The UID of currently signed in user
 * @param cartId The UID of the cart document that will be edited
 * @param newCart New version of the cart document
 * @param onEditedCart Callback handler when this operation is success or not
 */
export const editCartInFirebase = (
  userId: string,
  cartId: string,
  newCart: object,
  onEditedCart: (success: boolean) => void
) => {
  const cartRef = doc(db, COL_USERS, userId, COL_USERS_CARTS, cartId);
  updateDoc(cartRef, newCart)
    .then(() => {
      console.log(
        `carts.editCartInFirebase: Successfully updated cart with id ${cartId}`
      );
      onEditedCart(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `carts.editCartInFirebase: There is an error updating cart with id ${cartId}`
        );
      }
      onEditedCart(false);
    });
};
