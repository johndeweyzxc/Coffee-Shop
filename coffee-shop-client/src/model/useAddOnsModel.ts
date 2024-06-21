import { Unsubscribe } from "firebase/auth";
import {
  AddOn,
  UAddOn,
  appendAddOnInCartInFirebase,
  getAddOnsInCartInFirebase,
  getAddOnsInFirebase,
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
    uAddOn: UAddOn,
    cb: (success: boolean) => void
  ) => {
    appendAddOnInCartInFirebase(userId, cartId, uAddOn, cb);
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

  return {
    getAddOns,
    getAddOnsInCart,
    appendAddOnsInCart,
  };
};

export default useAddOnsModel;
