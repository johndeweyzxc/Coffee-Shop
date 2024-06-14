import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Product, UProduct } from "../../model/api/products";
import { GridColDef, GridEventListener } from "@mui/x-data-grid";
import {
  ADMIN_NEW_PRODUCT,
  IN_DESCRIPTION,
  IN_NAME,
  IN_PRICE,
} from "../../strings";
import {
  LOGIN_WITH_EMAIL_STATUS,
  PRODUCTS_STATUS,
  SIGNOUT_STATUS,
} from "../../status";
import useAdminViewModel from "../../viewmodel/useAdminViewModel";
import Notification from "../../components/Notification";
import { LoginAsAdmin } from "../../model/auth/appAuth";
import { Unsubscribe, User } from "firebase/auth";
import { AddOn, UAddOn } from "../../model/api/addOns";

export interface InputHelperText {
  IsErrName: boolean;
  NameText: string;
  IsErrDescription: boolean;
  DescriptionText: string;
  IsErrPrice: boolean;
  PriceText: string;
}

export const useAdminController = () => {
  const notify = Notification();

  const {
    getAddOns,
    addAddOnsVM,
    removeAddOn,

    getProducts,
    uploadProductVM,
    updateProductVM,
    deleteProduct,

    signInEmail,
    signOut,
  } = useAdminViewModel();

  const productCol: GridColDef<(typeof products)[number]>[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Name",
      headerName: "Name",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Description",
      headerName: "Description",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Price",
      headerName: "Price",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
  ];

  // * STATE MANAGEMENT FOR AUTHENTICATION
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const onOpenLogin = () => setIsOpenLogin(true);
  const onCloseLogin = () => (window.location.href = "/");
  const [loginData, setLoginData] = useState<LoginAsAdmin>({
    Username: "",
    Password: "",
  });
  const onChangeLoginData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  const onLoginAdmin = (e: FormEvent<HTMLFormElement>) => {
    setIsOpenLogin(false);
    e.preventDefault();
    const onSignedInWithEmail = (
      _: User | null,
      status: LOGIN_WITH_EMAIL_STATUS
    ) => {
      if (status === LOGIN_WITH_EMAIL_STATUS.ERROR) {
        notify.HandleOpenAlert(
          "error",
          "There is an error signing in with email"
        );
        setIsLoggedIn(false);
      } else if (status === LOGIN_WITH_EMAIL_STATUS.SUCCESS) {
        setIsLoggedIn(true);
      }
    };
    signInEmail(loginData, onSignedInWithEmail);
  };

  // * STATE MANAGEMENT FOR CREATING NEW PRODUCT
  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);
  const onOpenUpload = () => setIsOpenUpload(true);
  const onCloseUpload = () => setIsOpenUpload(false);

  const [newProduct, setNewProduct] = useState<Product>({
    Name: "",
    Description: "",
    Price: "",
  });
  const [addOnListNewProduct, setAddOnListNewProduct] = useState<AddOn[]>([]);
  const [currAddOnNewProduct, setCurrAddOnNewProduct] = useState<AddOn>({
    Name: "",
    Price: "",
  });
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
    setCurrAddOnNewProduct({
      Name: "",
      Price: "",
    });
  };
  const onAddAddOnsNewProduct = () => {
    const onlyNumReg = /^[0-9]*$/;
    const name = currAddOnNewProduct.Name;
    const price = currAddOnNewProduct.Price as string;

    if (name.length === 0 || price.length === 0) {
      notify.HandleOpenAlert("warning", "Add on cannot be empty");
      return;
    } else if (!onlyNumReg.test(price)) {
      notify.HandleOpenAlert("warning", "Price should be a number");
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
  const [inputHelperText, setInputHelperText] = useState<InputHelperText>({
    IsErrName: false,
    NameText: "",
    IsErrDescription: false,
    DescriptionText: "",
    IsErrPrice: false,
    PriceText: "",
  });
  const onUploadProduct = () => {
    const onUploaded = (success: boolean) => {
      if (success) {
        notify.HandleOpenAlert("success", "Successfully uploaded new product");
      } else {
        notify.HandleOpenAlert("error", "Failed to upload new product");
      }
    };
    const result = uploadProductVM(newProduct, addOnListNewProduct, onUploaded);

    const isInputValid = result[0];
    const inputContext = result[1];
    const inHelperText = result[2];

    if (!isInputValid) {
      setInputHelperText({
        IsErrName: false,
        NameText: "",
        IsErrDescription: false,
        DescriptionText: "",
        IsErrPrice: false,
        PriceText: "",
      });

      switch (inputContext) {
        case IN_NAME:
          setInputHelperText({
            IsErrName: true,
            NameText: inHelperText,
            IsErrDescription: false,
            DescriptionText: "",
            IsErrPrice: false,
            PriceText: "",
          });
          break;
        case IN_DESCRIPTION:
          setInputHelperText({
            IsErrName: false,
            NameText: "",
            IsErrDescription: true,
            DescriptionText: inHelperText,
            IsErrPrice: false,
            PriceText: "",
          });
          break;
        case IN_PRICE:
          setInputHelperText({
            IsErrName: false,
            NameText: "",
            IsErrDescription: false,
            DescriptionText: "",
            IsErrPrice: true,
            PriceText: inHelperText,
          });
          break;
        default:
          break;
      }
    }

    if (isInputValid) {
      onCloseUpload();
      setNewProduct({
        Name: "",
        Description: "",
        Price: "",
      });
    }
  };

  // * STATE MANAGEMENT FOR UPDATING A PRODUCT
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const onOpenUpdate = () => setIsOpenUpdate(true);
  const onCloseUpdate = () => {
    setIsOpenUpdate(false);
    setCurrAddOnNewProduct({
      Name: "",
      Price: "",
    });
  };
  const [updateProduct, setUpdateProduct] = useState<UProduct>({
    id: "",
    Name: "",
    Description: "",
    Price: "",
  });
  const [addOnListUProduct, setAddOnListUProduct] = useState<UAddOn[]>([]);
  const [currAddOnUProduct, setCurrAddOnUProduct] = useState<AddOn>({
    Name: "",
    Price: "",
  });
  const onChangeAddOnUProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Price" && parseInt(value) < 0) return;
    setCurrAddOnUProduct({ ...currAddOnUProduct, [name]: value });
  };
  const onGetAddOnsForUProduct = (): Unsubscribe => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns === null) {
        notify.HandleOpenAlert("error", "Error fetching addons");
      } else {
        setAddOnListUProduct(uAddOns);
      }
    };
    return getAddOns(updateProduct.id, onAddOns);
  };
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    if (isOpenUpdate) {
      console.log(
        `[useAdminController] Adding addons listener for product ${updateProduct.Name}`
      );
      unsubscribe = onGetAddOnsForUProduct();
    } else {
      console.log(
        `[useAdminController] Removing addons listener for product ${updateProduct.Name}`
      );
      if (unsubscribe !== null) {
        const unsub = unsubscribe as Unsubscribe;
        unsub();
      }
    }
    return () => {
      if (unsubscribe !== null) {
        unsubscribe();
      }
    };
  }, [isOpenUpdate]);
  const onRemoveAddOnUProduct = (name: string, addOnId: string) => {
    const onRemovedAddOn = (success: boolean) => {
      if (!success) {
        notify.HandleOpenAlert("error", "Failed to remove addon");
      } else {
        setCurrAddOnUProduct({
          Name: "",
          Price: "",
        });
      }
    };
    removeAddOn(updateProduct.id, addOnId, onRemovedAddOn);
  };
  const onAddAddOnsUProduct = () => {
    const onlyNumReg = /^[0-9]*$/;
    const name = currAddOnUProduct.Name;
    const price = currAddOnUProduct.Price as string;

    if (name.length === 0 || price.length === 0) {
      notify.HandleOpenAlert("warning", "Add on cannot be empty");
      return;
    } else if (!onlyNumReg.test(price)) {
      notify.HandleOpenAlert("warning", "Price should be a number");
      return;
    }

    const onAddedAddOns = (success: boolean, _: string | null) => {
      if (!success) {
        notify.HandleOpenAlert("error", "Failed to add new addons");
      } else {
        setCurrAddOnUProduct({
          Name: "",
          Price: "",
        });
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
        notify.HandleOpenAlert("success", "Successfully updated product");
      } else {
        notify.HandleOpenAlert("error", "Failed to update product");
      }
    };
    updateProductVM(updateProduct, updateProduct.id, onUpdated);
    onCloseUpdate();
    setUpdateProduct({
      id: "",
      Name: "",
      Description: "",
      Price: "",
    });
  };

  const onDeleteProduct = () => {
    const onDeleted = (success: boolean) => {
      if (success) {
        notify.HandleOpenAlert("success", "Successfully deleted product");
      } else {
        notify.HandleOpenAlert("error", "Failed to delete product");
      }
    };
    deleteProduct(updateProduct.id, onDeleted);
    onCloseUpdate();
    setUpdateProduct({
      id: "",
      Name: "",
      Description: "",
      Price: "",
    });
  };

  const [products, setProducts] = useState<UProduct[]>([]);
  const onProductClicked: GridEventListener<"rowClick"> = (params) => {
    setUpdateProduct(params.row);
    onOpenUpdate();
  };

  const [selectedNav, setSelectedNav] = useState<string>(ADMIN_NEW_PRODUCT);
  const onSelectedNav = (name: string) => {
    if (name === ADMIN_NEW_PRODUCT) onOpenUpload();
    else setSelectedNav(name);
  };

  useEffect(() => {
    signOut((status: SIGNOUT_STATUS) => {
      if (status === SIGNOUT_STATUS.SUCCESS) {
        onOpenLogin();
      } else if (status === SIGNOUT_STATUS.ERROR) {
        notify.HandleOpenAlert("error", "Error signing out user");
      }
    });
  }, []);

  useEffect(() => {
    let unsubscribeProduct: Unsubscribe | null = null;

    const onProducts = (
      products: UProduct[] | null,
      status: PRODUCTS_STATUS
    ) => {
      if (status === PRODUCTS_STATUS.FETCHED) {
        setProducts(products!);
      } else if (status === PRODUCTS_STATUS.PERMISSION_ERROR) {
        signOut((status: SIGNOUT_STATUS) => {
          if (status === SIGNOUT_STATUS.ERROR) {
            notify.HandleOpenAlert(
              "error",
              "There is an error while signing out"
            );
            return;
          }
          onOpenLogin();
        });
      } else if (status === PRODUCTS_STATUS.ERROR) {
        notify.HandleOpenAlert("error", "Failed to fetched product data");
      }
    };

    if (isLoggedIn) {
      console.log("[useAdminController] Adding product listener");
      unsubscribeProduct = getProducts(onProducts);
    }

    return () => {
      console.log("[useAdminController] Removing product listener");
      if (unsubscribeProduct !== null) unsubscribeProduct();
    };
  }, [isLoggedIn]);

  const alertSnackbar = notify.SnackBar;
  return {
    inputHelperText,
    alertSnackbar,

    // * STATE MANAGEMENT INTERFACE FOR AUTHENTICATION
    isOpenLogin,
    onOpenLogin,
    onCloseLogin,
    onChangeLoginData,
    onLoginAdmin,

    // * STATE MANAGEMENT INTERFACE FOR UPLOADING PRODUCT
    addOnListNewProduct,
    currAddOnNewProduct,
    onChangeAddOnNewProduct,
    onAddAddOnsNewProduct,
    onRemoveAddOnNewProduct,

    isOpenUpload,
    onOpenUpload,
    onCloseUpload,
    newProduct,
    onChangeNewProduct,
    onUploadProduct,

    // * STATE MANAGEMENT INTERFACE FOR UPDATING PRODUCT
    addOnListUProduct,
    currAddOnUProduct,
    onChangeAddOnUProduct,
    onGetAddOnsForUProduct,
    onRemoveAddOnUProduct,
    onAddAddOnsUProduct,

    isOpenUpdate,
    onOpenUpdate,
    onCloseUpdate,
    updateProduct,
    onChangeUpdateProduct,
    onUpdateProduct,

    onDeleteProduct,

    // * STATE MANAGEMENT INTERFACE FOR RETRIEVING PRODUCT
    products,
    productCol,
    onProductClicked,

    selectedNav,
    onSelectedNav,

    signOut,
  };
};
