import { Unsubscribe } from "firebase/auth";

import useAddOnsModel, { UAddOn } from "../model/useAddOnsModel";
import useAppAuthModel from "../model/useAppAuthModel";
import useProductsModel from "../model/useProductsModel";
import { AddOn } from "../model/useAddOnsModel";
import { Product, UProduct } from "../model/useProductsModel";
import { IN_DESCRIPTION, IN_NAME, IN_PRICE, IN_SUCCESS } from "../strings";
import useOrdersModel from "../model/useOrdersModel";

const useAdminViewModel = () => {
  const {
    listenProducts,
    uploadProduct,
    updateProduct,
    deleteProduct,
    getProductImageURL,
    uploadProductImage,
  } = useProductsModel();
  const { signInEmail, signOut, addAuthListener } = useAppAuthModel();
  const { listenAddOns, getAddOns, uploadAddOn, deleteAddOn } =
    useAddOnsModel();
  const { listenOrders, deleteOrder, updateStatusOfOrder } = useOrdersModel();

  const listenProductsVM = (
    onProducts: (products: UProduct[] | null) => void
  ): Unsubscribe => {
    let listUProductVM: UProduct[] = [];
    let totalProducts: number | undefined = 0;
    let productsProcessed = 0;

    const createProductVM = (product: UProduct) => {
      const onGotProductImageUrl = (url: string) => {
        const newUProductVM: UProduct = { ...product, ProductImageURL: url };
        listUProductVM = [...listUProductVM, newUProductVM];
        productsProcessed++;

        if (totalProducts === productsProcessed) {
          onProducts(listUProductVM);
          productsProcessed = 0;
        }
      };
      getProductImageURL(product.id, onGotProductImageUrl);
    };

    const onReceivedProducts = (products: UProduct[] | null) => {
      totalProducts = products?.length;
      listUProductVM = [];
      products?.forEach((product) => createProductVM(product));
    };

    return listenProducts(onReceivedProducts);
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

    const onUploadedProduct = (success: boolean, productId: string) => {
      if (success) {
        let uploadedAddOns = 1;
        addOnList.forEach((addOn) => {
          const onAddedAddOns = (success: boolean, _: string | null) => {
            if (success) {
              if (addOnList?.length === uploadedAddOns) {
                onUploaded(true);
              }
            } else {
              onUploaded(false);
            }
            uploadedAddOns++;
          };
          uploadAddOn(productId, addOn, onAddedAddOns);
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

  const deleteProductVM = (
    productId: string,
    onDeleted: (success: boolean) => void
  ) => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      let deletedAddOns = 1;
      const onDeletedAddOn = (success: boolean) => {
        if (success) {
          if (uAddOns?.length === deletedAddOns) {
            onDeleted(true);
          }
        } else {
          onDeleted(false);
        }
        deletedAddOns++;
      };
      uAddOns?.forEach((uAddOn) => {
        deleteAddOn(productId, uAddOn.id, onDeletedAddOn);
      });
    };

    const onDeletedProduct = (success: boolean) => {
      if (success) {
        getAddOns(productId, onAddOns);
      } else {
        onDeleted(false);
      }
    };
    deleteProduct(productId, onDeletedProduct);
  };

  return {
    listenAddOns,
    uploadAddOn,
    deleteAddOn,

    listenProductsVM,
    uploadProductVM,
    updateProductVM,
    deleteProductVM,

    signInEmail,
    signOut,
    addAuthListener,
  };
};

export default useAdminViewModel;
