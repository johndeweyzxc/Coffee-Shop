import { Unsubscribe } from "firebase/auth";
import {
  AddOn,
  UAddOn,
  appendAddOnInCartInFirebase,
  getAddOnsInCartInFirebase,
  getAddOnsInFirebase,
  removeAddOnInCartInFirebase,
} from "./api/addons";
import { QuerySnapshot } from "firebase/firestore";

const useAddOnsModel = () => {
  const getAddOns = (
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
    return getAddOnsInFirebase(productId, cb);
  };

  const appendAddOnsInCart = (
    userId: string,
    cartId: string,
    addOn: AddOn,
    cb: (success: boolean) => void
  ) => {
    appendAddOnInCartInFirebase(userId, cartId, addOn, cb);
  };

  const getAddOnsInCart = (
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
    return getAddOnsInCartInFirebase(userId, cartId, cb);
  };

  const removeAddOnInCart = (
    userId: string,
    cartId: string,
    addOnId: string,
    cb: (success: boolean) => void
  ) => {
    removeAddOnInCartInFirebase(userId, cartId, addOnId, cb);
  }

  return {
    getAddOns,
    getAddOnsInCart,
    appendAddOnsInCart,
    removeAddOnInCart,
  };
};

export default useAddOnsModel;
