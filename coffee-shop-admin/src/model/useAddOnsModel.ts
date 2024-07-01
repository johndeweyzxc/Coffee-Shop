import { Unsubscribe } from "firebase/auth";
import { QuerySnapshot } from "firebase/firestore";

import {
  addAddOnInFirebase,
  getAddOnsInFirebase,
  removeAddOnInFirebase,
} from "./api/addOns";

export interface AddOn {
  Name: string;
  Price: string | number;
}

export interface UAddOn extends AddOn {
  id: string;
}

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
          Name: s.Name,
          Price: s.Price,
        };
        uAddOnList.push(uAddOn);
      });
      onAddOns(uAddOnList);
    };
    return getAddOnsInFirebase(productId, cb);
  };

  const addAddOns = (
    productId: string,
    addOn: AddOn,
    cb: (success: boolean, addOnId: string | null) => void
  ) => {
    addAddOnInFirebase(productId, addOn, cb);
  };

  const removeAddOn = (
    productId: string,
    addOnId: string,
    cb: (success: boolean) => void
  ) => {
    removeAddOnInFirebase(productId, addOnId, cb);
  };

  return {
    getAddOns,
    addAddOns,
    removeAddOn,
  };
};

export default useAddOnsModel;
