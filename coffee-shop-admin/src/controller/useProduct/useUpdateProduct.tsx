import { ChangeEvent, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/firestore";

import { AddOn, UAddOn } from "../../model/useAddOnsModel";
import { UProduct } from "../../model/useProductsModel";
import useAdminViewModel from "../../viewmodel/useAdminViewModel";

export default function useUpdateProduct(
  setCurrAddOnNewProduct: (value: React.SetStateAction<AddOn>) => void,
  handleOpenAlert: (severity: string, message: string) => void
) {
  const {
    getAddOns,
    addAddOnsVM,
    removeAddOn,
    updateProductVM,
    deleteProduct,
  } = useAdminViewModel();

  const EMPTY_ADDON = () => {
    return {
      Name: "",
      Price: "",
    };
  };
  const EMPTY_PRODUCT = () => {
    return {
      id: "",
      Name: "",
      Description: "",
      Price: "",
      ProductImageURL: "",
    };
  };

  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [updateProduct, setUpdateProduct] = useState<UProduct>(EMPTY_PRODUCT());
  const [addOnListUProduct, setAddOnListUProduct] = useState<UAddOn[]>([]);
  const [currAddOnUProduct, setCurrAddOnUProduct] = useState<AddOn>(
    EMPTY_ADDON()
  );

  const onSetUProductImage = (file: File) => setProductImage(file);
  const onOpenUpdate = () => setIsOpenUpdate(true);
  const onCloseUpdate = () => {
    setIsOpenUpdate(false);
    setCurrAddOnNewProduct(EMPTY_ADDON());
  };
  const onChangeAddOnUProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Price" && parseInt(value) < 0) return;
    setCurrAddOnUProduct({ ...currAddOnUProduct, [name]: value });
  };
  const onGetAddOnsForUProduct = (): Unsubscribe => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns === null) {
        handleOpenAlert("error", "Error fetching addons");
      } else {
        setAddOnListUProduct(uAddOns);
      }
    };
    return getAddOns(updateProduct.id, onAddOns);
  };
  const onRemoveAddOnUProduct = (name: string, addOnId: string) => {
    const onRemovedAddOn = (success: boolean) => {
      if (!success) {
        handleOpenAlert("error", "Failed to remove addon");
      } else {
        setCurrAddOnUProduct(EMPTY_ADDON());
      }
    };
    removeAddOn(updateProduct.id, addOnId, onRemovedAddOn);
  };
  const onAddAddOnsUProduct = () => {
    const onlyNumReg = /^[0-9]*$/;
    const name = currAddOnUProduct.Name;
    const price = currAddOnUProduct.Price as string;

    if (name.length === 0 || price.length === 0) {
      handleOpenAlert("warning", "Add on cannot be empty");
      return;
    } else if (!onlyNumReg.test(price)) {
      handleOpenAlert("warning", "Price should be a number");
      return;
    }

    const onAddedAddOns = (success: boolean, _: string | null) => {
      if (!success) {
        handleOpenAlert("error", "Failed to add new addons");
      } else {
        setCurrAddOnUProduct(EMPTY_ADDON());
      }
    };
    addAddOnsVM(updateProduct.id, currAddOnUProduct, onAddedAddOns);
  };
  const onChangeUpdateProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };
  const onUpdateProduct = () => {
    const onUpdated = (success: boolean) => {
      if (success) {
        handleOpenAlert("success", "Successfully updated product");
      } else {
        handleOpenAlert("error", "Failed to update product");
      }
    };
    updateProductVM(updateProduct, productImage, updateProduct.id, onUpdated);
    onCloseUpdate();
    setUpdateProduct(EMPTY_PRODUCT());
  };
  const onDeleteProduct = () => {
    const onDeleted = (success: boolean) => {
      if (success) {
        handleOpenAlert("success", "Successfully deleted product");
      } else {
        handleOpenAlert("error", "Failed to delete product");
      }
    };
    deleteProduct(updateProduct.id, onDeleted);
    onCloseUpdate();
    setUpdateProduct(EMPTY_PRODUCT());
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    if (isOpenUpdate) {
      console.log(
        `[useAdminController] Adding addons listener for product ${updateProduct.Name}`
      );
      unsubscribe = onGetAddOnsForUProduct();
    } else {
      if (unsubscribe !== null) {
        console.log(
          `[useAdminController] Removing addons listener for product ${updateProduct.Name}`
        );
        const unsub = unsubscribe as Unsubscribe;
        unsub();
      }
    }
    return () => {
      if (unsubscribe !== null) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenUpdate]);

  return {
    addOnListUProduct,
    currAddOnUProduct,
    onChangeAddOnUProduct,
    onGetAddOnsForUProduct,
    onRemoveAddOnUProduct,
    onAddAddOnsUProduct,
    onSetUProductImage,

    isOpenUpdate,
    onOpenUpdate,
    onCloseUpdate,
    updateProduct,

    onChangeUpdateProduct,
    onUpdateProduct,

    onDeleteProduct,
    setUpdateProduct,
  };
}
