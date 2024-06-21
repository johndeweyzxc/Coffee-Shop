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
import {
  COL_ADDONS,
  COL_PRODUCTS,
  COL_USERS,
  COL_USERS_CARTS,
} from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export interface AddOn {
  AddOnId: string;
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

export const getAddOnsInCartInFirebase = (
  userId: string,
  cartId: string,
  cb: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(
    collection(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `carts.getAddOnsInCartInFirebase: Fetched ${snapshot.size} addon data`
      );
      cb(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.getAddOnsInCartInFirebase: There is an error fetching addon data"
      );
      cb(null);
    }
  );
};

export const appendAddOnInCartInFirebase = (
  userId: string,
  cartId: string,
  uAddOn: UAddOn,
  cb: (success: boolean) => void
) => {
  addDoc(
    collection(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS),
    uAddOn
  )
    .then((value) => {
      console.log(
        `addOns.appendAddOnInCartInFirebase: Successfully added addon with id ${value.id} in addons for cart with id ${cartId}`
      );
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.appendAddOnInCartInFirebase: There is an error adding addon with name ${uAddOn.Name} in addons for cart with id ${cartId}`
        );
        cb(false);
      }
    });
};

export const removeAddOnInCartInFirebase = (
  userId: string,
  cartId: string,
  cb: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_USERS, userId, COL_USERS_CARTS, cartId))
    .then(() => {
      console.log(
        `addOns.removeAddOnInCartInFirebase: Successfully deleted addon from user with id ${userId} from cart with id ${cartId}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.removeAddOnInCartInFirebase: There is an error deleting addon from user with id ${userId} from cart with id ${cartId}`
        );
        cb(false);
      }
    });
};