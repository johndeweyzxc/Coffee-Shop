import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../../firebaseConf";
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
import {
  COL_ADDONS,
  COL_ORDERS,
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

export const listenAddOnsInFirebase = (
  productId: string,
  cb: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_PRODUCTS, productId, COL_ADDONS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `carts.listenAddOnsInFirebase: Fetched ${snapshot.size} addon data`
      );
      cb(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.listenAddOnsInFirebase: There is an error fetching addon data"
      );
      cb(null);
    }
  );
};

export const listenAddOnsInCartInFirebase = (
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
        `carts.listenAddOnsInCartInFirebase: Fetched ${snapshot.size} addon data`
      );
      cb(snapshot);
    },
    (error: FirestoreError) => {
      console.log(error.message);
      console.log(
        "carts.listenAddOnsInCartInFirebase: There is an error fetching addon data"
      );
      cb(null);
    }
  );
};

export const getAddOnsInCartInFirebase = (
  userId: string,
  cartId: string,
  cb: (snapshot: QueryDocumentSnapshot[] | null) => void
) => {
  const q = query(
    collection(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS)
  );
  getDocs(q)
    .then((value) => {
      console.log(
        `carts.getAddOnsInCartInFirebase: Fetched ${value.size} addon data`
      );
      cb(value.docs);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          "carts.getAddOnsInCartInFirebase: There is an error fetching addon data"
        );
      }
      cb(null);
    });
};

export const appendAddOnInCartInFirebase = (
  userId: string,
  cartId: string,
  addOn: AddOn,
  cb: (success: boolean) => void
) => {
  addDoc(
    collection(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS),
    addOn
  )
    .then((value) => {
      console.log(
        `addOns.appendAddOnInCartInFirebase: Successfully added addon with id ${value.id} in addons for cart with id ${cartId}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addOns.appendAddOnInCartInFirebase: There is an error adding addon with name ${addOn.Name} in addons for cart with id ${cartId}`
        );
      }
      cb(false);
    });
};

export const removeAddOnInCartInFirebase = (
  userId: string,
  cartId: string,
  addOnId: string,
  cb: (success: boolean) => void
) => {
  deleteDoc(
    doc(db, COL_USERS, userId, COL_USERS_CARTS, cartId, COL_ADDONS, addOnId)
  )
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
      }
      cb(false);
    });
};

export const appendAddOnInOrderInFirebase = (
  orderId: string,
  addOn: AddOn,
  cb: (success: boolean) => void
) => {
  addDoc(collection(db, COL_ORDERS, orderId, COL_ADDONS), addOn)
    .then(() => {
      console.log(
        `addons.appendAddOnInOrderInFirebase: Successfully appended addon to order where order id is ${orderId}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `addons.appendAddOnInOrderInFirebase: There is an error adding addon to order where order id is ${orderId}`
        );
      }
      cb(false);
    });
};
