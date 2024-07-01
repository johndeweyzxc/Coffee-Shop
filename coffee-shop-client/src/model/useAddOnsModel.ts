import { Unsubscribe } from "firebase/auth";
import {
  AddOn,
  UAddOn,
  appendAddOnInCartInFirebase,
  appendAddOnInOrderInFirebase,
  getAddOnsInCartInFirebase,
  listenAddOnsInCartInFirebase,
  listenAddOnsInFirebase,
  removeAddOnInCartInFirebase,
} from "./api/addons";
import {
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

const useAddOnsModel = () => {
  const listenAddOns = (
    productId: string,
    onAddOns: (uAddOns: UAddOn[] | null) => void
  ): Unsubscribe => {
    const cb = (snapshot: QuerySnapshot | null) => {
      if (snapshot === null) {
        onAddOns(null);
        return;
      }

      const uAddOnList: UAddOn[] = [];
      snapshot.forEach((doc) => {
        const s = doc.data() as AddOn;
        const uAddOn: UAddOn = {
          id: doc.id,
          AddOnId: s.AddOnId,
          Name: s.Name,
          Price: s.Price,
        };
        uAddOnList.push(uAddOn);
      });
      onAddOns(uAddOnList);
    };
    return listenAddOnsInFirebase(productId, cb);
  };

  const appendAddOnsInCart = (
    userId: string,
    cartId: string,
    addOn: AddOn,
    cb: (success: boolean) => void
  ) => {
    appendAddOnInCartInFirebase(userId, cartId, addOn, cb);
  };

  const listenAddOnsInCart = (
    userId: string,
    cartId: string,
    onAddOns: (uAddOns: UAddOn[] | null) => void
  ) => {
    const cb = (snapshot: QuerySnapshot | null) => {
      if (snapshot === null) {
        onAddOns(null);
        return;
      }

      const uAddOnList: UAddOn[] = [];
      snapshot.forEach((doc) => {
        const s = doc.data() as AddOn;
        const uAddOn: UAddOn = {
          id: doc.id,
          AddOnId: s.AddOnId,
          Name: s.Name,
          Price: s.Price,
        };
        uAddOnList.push(uAddOn);
      });
      onAddOns(uAddOnList);
    };
    return listenAddOnsInCartInFirebase(userId, cartId, cb);
  };

  const getAddOnsInCart = (
    userId: string,
    cartId: string,
    onAddOns: (addOns: UAddOn[] | null) => void
  ) => {
    const cb = (snapshot: QueryDocumentSnapshot[] | null) => {
      if (snapshot != null) {
        const addOns: UAddOn[] = [];

        snapshot.forEach((uAddOn) => {
          const s = uAddOn.data() as UAddOn;
          const newUAddOn: UAddOn = {
            id: uAddOn.id,
            AddOnId: s.AddOnId,
            Name: s.Name,
            Price: s.Price,
          };
          addOns.push(newUAddOn);
        });
        onAddOns(addOns);
      } else {
        onAddOns(null);
      }
    };
    getAddOnsInCartInFirebase(userId, cartId, cb);
  };

  const removeAddOnInCart = (
    userId: string,
    cartId: string,
    addOnId: string,
    cb: (success: boolean) => void
  ) => {
    removeAddOnInCartInFirebase(userId, cartId, addOnId, cb);
  };

  const appendAddOnInOrder = (
    orderId: string,
    addOn: AddOn,
    cb: (success: boolean) => void
  ) => {
    appendAddOnInOrderInFirebase(orderId, addOn, cb);
  };

  return {
    listenAddOns,
    listenAddOnsInCart,
    getAddOnsInCart,
    appendAddOnsInCart,
    removeAddOnInCart,
    appendAddOnInOrder,
  };
};

export default useAddOnsModel;
