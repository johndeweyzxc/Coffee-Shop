import {
  getProductImageURLInFirebase,
  listenProductInFirebase,
} from "./api/products";
import { QuerySnapshot } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import { PRODUCTS_STATUS } from "../status";

export interface Product {
  Name: string;
  Description: string;
  Price: number | string;
}

export interface UProduct extends Product {
  id: string;
  ProductImageURL: string;
}

const useProductsModel = () => {
  const listenProduct = (
    onProducts: (products: UProduct[] | null, status: PRODUCTS_STATUS) => void
  ): Unsubscribe => {
    const cb = (snapshot: QuerySnapshot | null, status: PRODUCTS_STATUS) => {
      if (snapshot === null) {
        onProducts(null, status);
        return;
      }

      const productList: UProduct[] = [];
      snapshot.forEach((doc) => {
        const s = doc.data() as Product;
        const uproduct: UProduct = {
          id: doc.id,
          Name: s.Name,
          Description: s.Description,
          Price: s.Price,
          ProductImageURL: "",
        };
        productList.push(uproduct);
      });
      onProducts(productList, status);
    };

    return listenProductInFirebase(cb);
  };

  const getProductImageURL = (productId: string, cb: (url: string) => void) => {
    getProductImageURLInFirebase(productId, cb);
  };

  return {
    listenProduct,
    getProductImageURL,
  };
};

export default useProductsModel;
