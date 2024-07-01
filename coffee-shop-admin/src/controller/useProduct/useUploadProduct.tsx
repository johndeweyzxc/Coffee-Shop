import { ChangeEvent, useState } from "react";

import { Product } from "../../model/useProductsModel";
import { AddOn } from "../../model/useAddOnsModel";
import useAdminViewModel from "../../viewmodel/useAdminViewModel";
import { IN_DESCRIPTION, IN_NAME, IN_PRICE } from "../../strings";

export interface InputHelperText {
  IsErrName: boolean;
  NameText: string;
  IsErrDescription: boolean;
  DescriptionText: string;
  IsErrPrice: boolean;
  PriceText: string;
}

export const useUploadProduct = (
  handleOpenAlert: (severity: string, message: string) => void
) => {
  const { uploadProductVM } = useAdminViewModel();

  const EMPTY_NEW_PRODUCT = () => {
    return {
      Name: "",
      Description: "",
      Price: "",
    };
  };
  const EMPTY_ADDON = () => {
    return {
      Name: "",
      Price: "",
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

  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [newProduct, setNewProduct] = useState<Product>(EMPTY_NEW_PRODUCT());
  const [addOnListNewProduct, setAddOnListNewProduct] = useState<AddOn[]>([]);
  const [currAddOnNewProduct, setCurrAddOnNewProduct] = useState<AddOn>(
    EMPTY_ADDON()
  );
  const [inputHelperText, setInputHelperText] = useState<InputHelperText>(
    DEFAULT_INPUT_HELPER_TEXT()
  );

  const onSetProductImage = (file: File) => setProductImage(file);
  const onOpenUpload = () => setIsOpenUpload(true);
  const onCloseUpload = () => setIsOpenUpload(false);
  const onChangeAddOnNewProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Price" && parseInt(value) < 0) return;
    setCurrAddOnNewProduct({ ...currAddOnNewProduct, [name]: value });
  };
  const onRemoveAddOnNewProduct = (name: string) => {
    const newAddOnList = addOnListNewProduct.filter(
      (addOn) => name !== addOn.Name
    );
    setAddOnListNewProduct(newAddOnList);
    setCurrAddOnNewProduct(EMPTY_ADDON());
  };
  const onAddAddOnsNewProduct = () => {
    const onlyNumReg = /^[0-9]*$/;
    const name = currAddOnNewProduct.Name;
    const price = currAddOnNewProduct.Price as string;

    if (name.length === 0 || price.length === 0) {
      handleOpenAlert("warning", "Add on cannot be empty");
      return;
    } else if (!onlyNumReg.test(price)) {
      handleOpenAlert("warning", "Price should be a number");
      return;
    }

    const newAddOns: AddOn = { Name: name, Price: price };
    setAddOnListNewProduct((prev) => [...prev, newAddOns]);
    setCurrAddOnNewProduct({
      Name: "",
      Price: "",
    });
  };
  const onChangeNewProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };
  const onUploadProduct = () => {
    const onUploaded = (success: boolean) => {
      if (success) {
        handleOpenAlert("success", "Successfully uploaded new product");
      } else {
        handleOpenAlert("error", "Failed to upload new product");
      }
    };
    const result = uploadProductVM(
      newProduct,
      productImage,
      addOnListNewProduct,
      onUploaded
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
      onCloseUpload();
      setNewProduct(EMPTY_NEW_PRODUCT());
    }
  };

  return {
    inputHelperText,

    addOnListNewProduct,
    currAddOnNewProduct,
    setCurrAddOnNewProduct,
    onChangeAddOnNewProduct,
    onAddAddOnsNewProduct,
    onRemoveAddOnNewProduct,
    onSetProductImage,

    isOpenUpload,
    onOpenUpload,
    onCloseUpload,
    newProduct,
    onChangeNewProduct,
    onUploadProduct,
  };
};
