import { Unsubscribe } from "firebase/auth";
import { QuerySnapshot } from "firebase/firestore";

import {
  appendAddOnInCartInFirebase,
  appendAddOnInOrderInFirebase,
  getAddOnsFromCartInFirebase,
  getAddOnsFromOrderInFirebase,
  listenAddOnsFromCartInFirebase,
  listenAddOnsFromProductInFirebase,
  removeAddOnFromCartInFirebase,
} from "./api/addons";

export interface AddOn {
  AddOnId: string;
  Name: string;
  Price: string | number;
}

export interface UAddOn extends AddOn {
  id: string;
}

const useAddOnsModel = () => {
  const convertQuerySnapshotUAddOn = (snapshot: QuerySnapshot) => {
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
    return uAddOnList;
  };

  const listenAddOnsFromProduct = (
    productId: string,
    onAddOns: (uAddOns: UAddOn[] | null) => void
  ): Unsubscribe => {
    const cb = (snapshot: QuerySnapshot | null) => {
      if (snapshot === null) {
        onAddOns(null);
        return;
      }
      const uAddOnList = convertQuerySnapshotUAddOn(snapshot);
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
      const uAddOnList = convertQuerySnapshotUAddOn(snapshot);
      onAddOns(uAddOnList);
    };
    return listenAddOnsFromCartInFirebase(userId, cartId, cb);
  };

  const getAddOnsFromCart = (
    userId: string,
    cartId: string,
    onAddOns: (addOns: UAddOn[] | null) => void
  ) => {
    const cb = (snapshot: QuerySnapshot | null) => {
      if (snapshot === null) {
        onAddOns(null);
        return;
      }
      const uAddOnList = convertQuerySnapshotUAddOn(snapshot);
      onAddOns(uAddOnList);
    };
    getAddOnsFromCartInFirebase(userId, cartId, cb);
  };

  const getAddOnsFromOrder = (
    orderId: string,
    onAddOns: (addOns: UAddOn[] | null) => void
  ) => {
    const cb = (snapshot: QuerySnapshot | null) => {
      if (snapshot === null) {
        onAddOns(null);
        return;
      }
      const uAddOnList = convertQuerySnapshotUAddOn(snapshot);
      onAddOns(uAddOnList);
    };
    getAddOnsFromOrderInFirebase(orderId, cb);
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
    getAddOnsFromOrder,
    appendAddOnInCart,
    removeAddOnInCart,
    appendAddOnInOrder,
  };
};

export default useAddOnsModel;
