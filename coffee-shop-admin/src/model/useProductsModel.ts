import {
  Product,
  UProduct,
  deleteProductInFirebase,
  getProductsInFirebase,
  updateProductInFirebase,
  uploadProductInFirebase,
} from "./api/products";
import { QuerySnapshot } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import { PRODUCTS_STATUS } from "../status";
import { AddOn } from "./api/addOns";

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
        };
        productList.push(uproduct);
      });
      onProducts(productList, status);
    };

    return getProductsInFirebase(cb);
  };

  const uploadProduct = (
    product: Product,
    addOnList: AddOn[],
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

  return {
    getProducts,
    uploadProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProductsModel;
