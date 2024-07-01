import { Unsubscribe } from "firebase/auth";

import useAddOnsModel from "../model/useAddOnsModel";
import useAppAuthModel from "../model/useAppAuthModel";
import useProductsModel from "../model/useProductsModel";
import { AddOn } from "../model/useAddOnsModel";
import { Product, UProduct } from "../model/useProductsModel";
import { PRODUCTS_STATUS } from "../status";
import { IN_DESCRIPTION, IN_NAME, IN_PRICE, IN_SUCCESS } from "../strings";

const useAdminViewModel = () => {
  const {
    getProducts,
    uploadProduct,
    updateProduct,
    deleteProduct,
    getProductImageURL,
    uploadProductImage,
  } = useProductsModel();
  const { signInEmail, signOut, addAuthListener } = useAppAuthModel();
  const { getAddOns, addAddOns, removeAddOn } = useAddOnsModel();

  const getProductsVM = (
    onProducts: (products: UProduct[] | null, status: PRODUCTS_STATUS) => void
  ): Unsubscribe => {
    let listUProductVM: UProduct[] = [];
    let totalProducts: number | undefined = 0;
    let productsProcessed = 0;

    const createProductVM = (product: UProduct, status: PRODUCTS_STATUS) => {
      const onGotProductImageUrl = (url: string) => {
        const newUProductVM: UProduct = { ...product, ProductImageURL: url };
        listUProductVM = [...listUProductVM, newUProductVM];
        productsProcessed++;

        if (totalProducts === productsProcessed) {
          onProducts(listUProductVM, status);
          productsProcessed = 0;
        }
      };
      getProductImageURL(product.id, onGotProductImageUrl);
    };

    const onReceivedProducts = (
      products: UProduct[] | null,
      status: PRODUCTS_STATUS
    ) => {
      totalProducts = products?.length;
      listUProductVM = [];
      products?.forEach((product) => createProductVM(product, status));
    };

    return getProducts(onReceivedProducts);
  };

  const uploadProductVM = (
    product: Product,
    productImage: File | null,
    addOnList: AddOn[],
    onUploaded: (success: boolean) => void
  ): [boolean, string, string] => {
    const newProduct: Product = { ...product };
    const onlyNumReg = /^[0-9]*$/;

    if (newProduct.Name.length === 0) {
      console.log("useAdminViewModel: Name cannot be empty");
      return [false, IN_NAME, "Name cannot be empty"];
    }
    if (newProduct.Description.length === 0) {
      console.log("useAdminViewModel: Description cannot be empty");
      return [false, IN_DESCRIPTION, "Description cannot be empty"];
    }
    if (
      newProduct.Price === "" ||
      !onlyNumReg.test(newProduct.Price as string)
    ) {
      console.log("useAdminViewModel: Invalid price");
      return [false, IN_PRICE, "Invalid price"];
    }

    newProduct.Price = parseInt(newProduct.Price as string);

    const newAddOnList: AddOn[] = [];
    addOnList.forEach((addOn) => {
      const newAddOn: AddOn = {
        ...addOn,
        Price: parseInt(addOn.Price as string),
      };
      newAddOnList.push(newAddOn);
    });

    const onUploadedProduct = (success: boolean, productId: string) => {
      if (success) {
        newAddOnList.forEach((addOn) => {
          const onAddedAddOns = (success: boolean, _: string | null) => {
            onUploaded(success);
          };
          addAddOns(productId, addOn, onAddedAddOns);
        });

        const onUploadedProductImage = (success: boolean) => {
          if (success) {
            console.log("[useAdminViewModel] Successfully uploaded image");
          } else {
            console.error("[useAdminViewModel] Failed to upload image");
          }
        };
        if (productImage !== null) {
          uploadProductImage(productId, productImage, onUploadedProductImage);
        }
      } else {
        onUploaded(false);
      }
    };
    uploadProduct(newProduct, onUploadedProduct);

    return [true, IN_SUCCESS, "Success"];
  };

  const updateProductVM = (
    product: Product,
    productImage: File | null,
    productId: string,
    onUpdated: (success: boolean) => void
  ): [boolean, string, string] => {
    const updatedProduct: Product = { ...product };
    const onlyNumReg = /^[0-9]*$/;

    if (updatedProduct.Name.length === 0) {
      console.log("useAdminViewModel: Name cannot be empty");
      return [false, IN_NAME, "Name cannot be empty"];
    }
    if (updatedProduct.Description.length === 0) {
      console.log("useAdminViewModel: Description cannot be empty");
      return [false, IN_DESCRIPTION, "Description cannot be empty"];
    }
    if (
      updatedProduct.Price === "" ||
      !onlyNumReg.test(updatedProduct.Price as string)
    ) {
      console.log("useAdminViewModel: Invalid price");
      return [false, IN_PRICE, "Invalid price"];
    }

    updatedProduct.Price = parseInt(updatedProduct.Price as string);

    const onUpdateProduct = (success: boolean) => {
      if (success) {
        onUpdated(true);
        const onUploadedProductImage = (success: boolean) => {
          if (success) {
            console.log("[useAdminViewModel] Successfully uploaded image");
          } else {
            console.error("[useAdminViewModel] Failed to upload image");
          }
        };
        if (productImage !== null) {
          uploadProductImage(productId, productImage, onUploadedProductImage);
        }
      } else {
        onUpdated(false);
      }
    };

    updateProduct(updatedProduct, productId, onUpdateProduct);
    return [true, IN_SUCCESS, "Success"];
  };

  const addAddOnsVM = (
    productId: string,
    addOn: AddOn,
    cb: (success: boolean, addOnId: string | null) => void
  ) => {
    const newAddOn: AddOn = {
      ...addOn,
      Price: parseInt(addOn.Price as string),
    };
    addAddOns(productId, newAddOn, cb);
  };

  return {
    getAddOns,
    addAddOnsVM,
    removeAddOn,

    getProductsVM,
    uploadProductVM,
    updateProductVM,
    deleteProduct,

    signInEmail,
    signOut,
    addAuthListener,
  };
};

export default useAdminViewModel;
