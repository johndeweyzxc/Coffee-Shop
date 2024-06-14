import { AddOn } from "../model/api/addOns";
import { Product } from "../model/api/products";
import useAddOnsModel from "../model/useAddOnsModel";
import useAppAuthModel from "../model/useAppAuthModel";
import useProductsModel from "../model/useProductsModel";
import { IN_DESCRIPTION, IN_NAME, IN_PRICE, IN_SUCCESS } from "../strings";

const useAdminViewModel = () => {
  const { getProducts, uploadProduct, updateProduct, deleteProduct } =
    useProductsModel();
  const { signInEmail, signOut } = useAppAuthModel();
  const { getAddOns, addAddOns, removeAddOn } = useAddOnsModel();

  const uploadProductVM = (
    product: Product,
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
      } else {
        onUploaded(false);
      }
    };
    uploadProduct(newProduct, addOnList, onUploadedProduct);

    return [true, IN_SUCCESS, "Success"];
  };

  const updateProductVM = (
    product: Product,
    id: string,
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

    updateProduct(updatedProduct, id, onUpdated);
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

    getProducts,
    uploadProductVM,
    updateProductVM,
    deleteProduct,

    signInEmail,
    signOut,
  };
};

export default useAdminViewModel;
