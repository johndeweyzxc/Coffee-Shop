import { ChangeEvent, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/firestore";

import { AddOn, UAddOn } from "../../model/useAddOnsModel";
import { UProduct } from "../../model/useProductsModel";
import useAdminViewModel from "../../viewmodel/useAdminViewModel";
import { IN_DESCRIPTION, IN_NAME, IN_PRICE } from "../../strings";

export interface InputHelperTextUpdate {
  IsErrName: boolean;
  NameText: string;
  IsErrDescription: boolean;
  DescriptionText: string;
  IsErrPrice: boolean;
  PriceText: string;
}

export default function useUpdateProduct(
  setCurrAddOnNewProduct: (value: React.SetStateAction<AddOn>) => void,
  handleOpenAlert: (severity: string, message: string) => void
) {
  const {
    listenAddOns,
    uploadAddOn,
    deleteAddOn,
    updateProductVM,
    deleteProductVM,
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
  const DEFAULT_INPUT_HELPER_TEXT = () => {
    return {
      IsErrName: false,
      NameText: "",
      IsErrDescription: false,
      DescriptionText: "",
      IsErrPrice: false,
      PriceText: "",
    };
  };
  const ERROR_IN_NAME = (inHelperText: string) => {
    return {
      IsErrName: true,
      NameText: inHelperText,
      IsErrDescription: false,
      DescriptionText: "",
      IsErrPrice: false,
      PriceText: "",
    };
  };
  const ERROR_IN_DESCRIPTION = (inHelperText: string) => {
    return {
      IsErrName: false,
      NameText: "",
      IsErrDescription: true,
      DescriptionText: inHelperText,
      IsErrPrice: false,
      PriceText: "",
    };
  };
  const ERROR_IN_PRICE = (inHelperText: string) => {
    return {
      IsErrName: false,
      NameText: "",
      IsErrDescription: false,
      DescriptionText: "",
      IsErrPrice: true,
      PriceText: inHelperText,
    };
  };

  // * STATE MANAGEMENT FOR UPDATING PRODUCT
  // Use in dialog when a product is clicked from the table
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  // The current image of a selected product from the table
  const [productImage, setProductImage] = useState<File | null>(null);
  // The current product that is selected from the table
  const [updateProduct, setUpdateProduct] = useState<UProduct>(EMPTY_PRODUCT());
  // The available addons of a selected product
  const [addOnListUProduct, setAddOnListUProduct] = useState<UAddOn[]>([]);
  // The currently selected addons of a selected product
  const [currAddOnUProduct, setCurrAddOnUProduct] = useState<AddOn>(
    EMPTY_ADDON()
  );
  // State for input helper text for showing input error causes
  const [inputHelperTextUpdate, setInputHelperText] =
    useState<InputHelperTextUpdate>(DEFAULT_INPUT_HELPER_TEXT());

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
    return listenAddOns(updateProduct.id, onAddOns);
  };
  const onRemoveAddOnUProduct = (addOnId: string) => {
    const onRemovedAddOn = (success: boolean) => {
      if (!success) {
        handleOpenAlert("error", "Failed to remove addon");
      } else {
        setCurrAddOnUProduct(EMPTY_ADDON());
      }
    };
    deleteAddOn(updateProduct.id, addOnId, onRemovedAddOn);
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
    uploadAddOn(updateProduct.id, currAddOnUProduct, onAddedAddOns);
  };
  const onChangeUpdateProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Price" && parseInt(value) < 0) return;
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
    const result = updateProductVM(
      updateProduct,
      productImage,
      updateProduct.id,
      onUpdated
    );

    const isInputValid = result[0];
    const inputContext = result[1];
    const inHelperText = result[2];
    if (!isInputValid) {
      setInputHelperText(DEFAULT_INPUT_HELPER_TEXT());

      switch (inputContext) {
        case IN_NAME:
          setInputHelperText(ERROR_IN_NAME(inHelperText));
          break;
        case IN_DESCRIPTION:
          setInputHelperText(ERROR_IN_DESCRIPTION(inHelperText));
          break;
        case IN_PRICE:
          setInputHelperText(ERROR_IN_PRICE(inHelperText));
          break;
        default:
          break;
      }
    }
    if (isInputValid) {
      onCloseUpdate();
      setUpdateProduct(EMPTY_PRODUCT());
      setInputHelperText(DEFAULT_INPUT_HELPER_TEXT());
    }
  };
  const onDeleteProduct = () => {
    const onDeleted = (success: boolean) => {
      if (success) {
        handleOpenAlert("success", "Successfully deleted product");
      } else {
        handleOpenAlert("error", "Failed to delete product");
      }
    };
    deleteProductVM(updateProduct.id, onDeleted);
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
    inputHelperTextUpdate,

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
