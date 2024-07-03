import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  FirestoreError,
  QuerySnapshot,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

import { Product } from "../useProductsModel";
import { FIREBASE_CONFIG } from "../../firebaseConf";
import { COL_PRODUCTS, STORAGE_PRODUCTS } from "../../strings";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

/**
 * Listens for any changes of product document in "Products" collection
 * @param onChange Callback handler when there is an update of any product document in "Products" collection
 * @returns Unsubscriber function to detach this listener
 */
export const listenProductsInFirebase = (
  onChange: (snapshot: QuerySnapshot | null) => void
): Unsubscribe => {
  const q = query(collection(db, COL_PRODUCTS));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(
        `products.listenProductsInFirebase: Fetched ${snapshot.size} product data`
      );
      onChange(snapshot);
    },
    (error: FirestoreError) => {
      console.log(
        "products.listenProductsInFirebase: There is an error fetching product data",
        error.message
      );
      onChange(null);
    }
  );
};

/**
 * Uploads a product document in "Products" collection
 * @param product The product that will be uploaded
 * @param onUploadedProduct Callback handler when this operation is success or not
 */
export const uploadProductInFirebase = (
  product: Product,
  onUploadedProduct: (success: boolean, productId: string) => void
) => {
  addDoc(collection(db, COL_PRODUCTS), product)
    .then((value) => {
      console.log(
        `products.uploadProductInFirebase: Successfully uploaded new product with id ${value.id}`
      );
      onUploadedProduct(true, value.id);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `products.uploadProductInFirebase: There is an error uploading new product ${product.Name}`
        );
        onUploadedProduct(false, "");
      }
    });
};

/**
 * Updates or edit the content of product document in "Products" collection
 * @param product New version of the product document
 * @param productId The UID of the product document that will be edited
 * @param onEditedCart Callback handler when this operation is success or not
 */
export const updateProductInFirebase = (
  product: Product,
  productId: string,
  onEditedCart: (success: boolean) => void
) => {
  const productRef = doc(db, COL_PRODUCTS, productId);
  updateDoc(productRef, {
    Name: product.Name,
    Description: product.Description,
    Price: product.Price,
  })
    .then(() => {
      console.log(
        `products.updateProductInFirebase: Successfully updated product with id ${productId}`
      );
      onEditedCart(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `products.updateProductInFirebase: There is an error updating product with id ${productId}`
        );
        onEditedCart(false);
      }
    });
};

/**
 * Deletes a product document in "Products" collection
 * @param productId The UID of the product document that will be deleted
 * @param onDeletedProduct Callback handler when this operation is success or not
 */
export const deleteProductInFirebase = (
  productId: string,
  onDeletedProduct: (success: boolean) => void
) => {
  deleteDoc(doc(db, COL_PRODUCTS, productId))
    .then(() => {
      console.log(
        `products.deleteProductInFirebase: Successfully deleted product with id ${productId}`
      );
      onDeletedProduct(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `products.deleteProductInFirebase: There is an error deleting product with id ${productId}`
        );
        onDeletedProduct(false);
      }
    });
};

/**
 * Uploads an image of a product in Firebase Storage
 * @param productId The UID of the product document
 * @param productImage Image file of a product
 * @param onUploadedProductImage Callback handler when this operation is success or not
 */
export const uploadProductImageInFirebase = (
  productId: string,
  productImage: File,
  onUploadedProductImage: (success: boolean) => void
) => {
  const storage = getStorage(app);
  const imageRef = ref(storage, `${STORAGE_PRODUCTS}/${productId}`);
  uploadBytes(imageRef, productImage)
    .then(() => {
      console.log(
        `products.uploadProductImageInFirebase: Successfully uploaded product image with id ${productId}`
      );
      onUploadedProductImage(true);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        console.log(reason);
        console.log(
          `products.uploadProductImageInFirebase: There is an error uploading product image with id ${productId}`
        );
        onUploadedProductImage(false);
      }
    });
};

/**
 * Gets the image URL of a product document if it exists in Firebase storage
 * @param productId The UID of a product document
 * @param onGotImageURL Callback handler when the URL is found
 */
export const getProductImageURLInFirebase = (
  productId: string,
  onGotImageURL: (url: string) => void
) => {
  const storage = getStorage(app);
  const imgRef = ref(storage, `${STORAGE_PRODUCTS}/${productId}`);

  getDownloadURL(imgRef)
    .then((url) => {
      onGotImageURL(url);
    })
    .catch((reason) => {
      if (reason !== null || reason !== undefined) {
        onGotImageURL("");
      }
    });
};
