import { Unsubscribe } from "firebase/auth";
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";

import {
  uploadAddOnInFirebase,
  listenAddOnsInFirebase,
  deleteAddOnInFirebase,
  getAddOnsInFirebase,
  getAddOnsFromOrderInFirebase,
} from "./api/addOns";

export interface AddOn {
  Name: string;
  Price: string | number;
}

export interface UAddOn extends AddOn {
  id: string;
}

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
          Name: s.Name,
          Price: s.Price,
        };
        uAddOnList.push(uAddOn);
      });
      onAddOns(uAddOnList);
    };
    return listenAddOnsInFirebase(productId, cb);
  };

  const getAddOns = (
    productId: string,
    onAddOns: (uAddOns: UAddOn[] | null) => void
  ) => {
    const cb = (snapshot: QueryDocumentSnapshot[] | null) => {
      if (snapshot === null) {
        onAddOns(null);
        return;
      }

      const addOns: UAddOn[] = [];
      snapshot.forEach((uAddOn) => {
        const s = uAddOn.data() as UAddOn;
        const newUAddOn: UAddOn = {
          id: uAddOn.id,
          Name: s.Name,
          Price: s.Price,
        };
        addOns.push(newUAddOn);
      });
      onAddOns(addOns);
    };
    getAddOnsInFirebase(productId, cb);
  };

  const uploadAddOn = (
    productId: string,
    addOn: AddOn,
    cb: (success: boolean, addOnId: string | null) => void
  ) => {
    const newAddOn: AddOn = {
      ...addOn,
      Price: parseInt(addOn.Price as string),
    };
    uploadAddOnInFirebase(productId, newAddOn, cb);
  };

  const deleteAddOn = (
    productId: string,
    addOnId: string,
    cb: (success: boolean) => void
  ) => {
    deleteAddOnInFirebase(productId, addOnId, cb);
  };

  const getAddOnsFromOrder = (
    orderId: string,
    onAddOns: (uAddOns: UAddOn[] | null) => void
  ) => {
    const cb = (snapshot: QueryDocumentSnapshot[] | null) => {
      if (snapshot === null) {
        onAddOns(null);
        return;
      }

      const addOns: UAddOn[] = [];
      snapshot.forEach((doc) => {
        const s = doc.data() as AddOn;
        const uAddOn: UAddOn = {
          id: doc.id,
          Name: s.Name,
          Price: s.Price,
        };
        addOns.push(uAddOn);
      });
      onAddOns(addOns);
    };
    getAddOnsFromOrderInFirebase(orderId, cb);
  };

  return {
    listenAddOns,
    getAddOns,
    getAddOnsFromOrder,
    uploadAddOn,
    deleteAddOn,
  };
};

export default useAddOnsModel;
