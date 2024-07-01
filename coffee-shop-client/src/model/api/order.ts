import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";

import { FIREBASE_CONFIG } from "../../firebaseConf";
import { COL_ORDERS } from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export interface ShippingAddress {
  Region: string;
  City: string;
  District: string;
  Street: string;
}

export interface ProductOrder {
  Name: string;
  Description: string;
  Price: string | number;
  TotalPrice: string | number;
  ProductId: string;
  Quantity: number;
}

export interface Order {
  ClientName: string;
  ClientUID: string;
  ProductOrderInfo: ProductOrder;
  ShippingAddressLocation: ShippingAddress;
  Status: string;
}

export interface UOrder extends Order {
  id: string;
  ProductImageURL: string;
}

export const addOrderInFirebase = (
  order: Order,
  cb: (success: boolean, orderId: string) => void
) => {
  addDoc(collection(db, COL_ORDERS), order)
    .then((value) => {
      console.log(
        `order.addOrderInFirebase: Successfully added order where id is ${value.id}`
      );
      cb(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `order.addOrderInFirebase: There is an error adding order where product id is ${order.ProductOrderInfo.ProductId}`
        );
        cb(false, "");
      }
    });
};

export const deleteOrderInFirebase = (
  orderId: string,
  cb: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_ORDERS, orderId))
    .then(() => {
      console.log(
        `order.deleteOrderInFirebase: Successfully deleted order with id ${orderId}`
      );
      cb(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `order.deleteOrderInFirebase: There is an error deleting order with id ${orderId}`
        );
      }
      cb(false);
    });
};
