import { QuerySnapshot } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";

import {
  deleteProductInFirebase,
  getProductImageURLInFirebase,
  getProductsInFirebase,
  updateProductInFirebase,
  uploadProductImageInFirebase,
  uploadProductInFirebase,
} from "./api/products";
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
  const getProducts = (
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

    return getProductsInFirebase(cb);
  };

  const uploadProduct = (
    product: Product,
    onUploaded: (success: boolean, productId: string) => void
  ) => {
    const cb = (success: boolean, productId: string) =>
      onUploaded(success, productId);
    uploadProductInFirebase(product, cb);
  };

  const updateProduct = (
    product: Product,
    id: string,
    onUpdated: (success: boolean) => void
  ) => {
    const cb = (success: boolean) => onUpdated(success);
    updateProductInFirebase(product, id, cb);
  };

  const deleteProduct = (id: string, onDeleted: (success: boolean) => void) => {
    const cb = (success: boolean) => onDeleted(success);
    deleteProductInFirebase(id, cb);
  };

  const getProductImageURL = (productId: string, cb: (url: string) => void) => {
    getProductImageURLInFirebase(productId, cb);
  };

  const uploadProductImage = (
    productId: string,
    productImage: File,
    cb: (success: boolean) => void
  ) => {
    uploadProductImageInFirebase(productId, productImage, cb);
  };

  return {
    getProducts,
    uploadProduct,
    updateProduct,
    deleteProduct,
    getProductImageURL,
    uploadProductImage,
  };
};

export default useProductsModel;
