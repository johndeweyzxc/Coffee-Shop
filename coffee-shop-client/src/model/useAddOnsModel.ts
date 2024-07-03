import { Unsubscribe } from "firebase/auth";
import {
  appendAddOnInCartInFirebase,
  appendAddOnInOrderInFirebase,
  getAddOnsFromCartInFirebase,
  listenAddOnsFromCartInFirebase,
  listenAddOnsFromProductInFirebase,
  removeAddOnFromCartInFirebase,
} from "./api/addons";
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";

export interface AddOn {
  AddOnId: string;
  Name: string;
  Price: string | number;
}

export interface UAddOn extends AddOn {
  id: string;
}

const useAddOnsModel = () => {
  const listenAddOnsFromProduct = (
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
    return listenAddOnsFromProductInFirebase(productId, cb);
  };

  const appendAddOnInCart = (
    userId: string,
    cartId: string,
    uAddOn: UAddOn,
    cb: (success: boolean) => void
  ) => {
    const addOn: AddOn = {
      AddOnId: uAddOn.id,
      Name: uAddOn.Name,
      Price: uAddOn.Price,
    };
    appendAddOnInCartInFirebase(userId, cartId, addOn, cb);
  };

  const listenAddOnsFromCart = (
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
    return listenAddOnsFromCartInFirebase(userId, cartId, cb);
  };

  const getAddOnsFromCart = (
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
    getAddOnsFromCartInFirebase(userId, cartId, cb);
  };

  const removeAddOnInCart = (
    userId: string,
    cartId: string,
    addOnId: string,
    cb: (success: boolean) => void
  ) => {
    removeAddOnFromCartInFirebase(userId, cartId, addOnId, cb);
  };

  const appendAddOnInOrder = (
    orderId: string,
    uAddOn: UAddOn,
    cb: (success: boolean) => void
  ) => {
    const addOn: AddOn = {
      AddOnId: uAddOn.AddOnId,
      Name: uAddOn.Name,
      Price: uAddOn.Price,
    };
    appendAddOnInOrderInFirebase(orderId, addOn, cb);
  };

  return {
    listenAddOnsFromProduct,
    listenAddOnsFromCart,
    getAddOnsFromCart,
    appendAddOnInCart,
    removeAddOnInCart,
    appendAddOnInOrder,
  };
};

export default useAddOnsModel;
