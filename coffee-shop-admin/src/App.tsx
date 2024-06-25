import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Typography } from "@mui/material";
import { createContext } from "react";

import useAppController from "./controller/useApp/useAppController";
import useUpdateProduct from "./controller/useProduct/useUpdateProduct";
import { useUploadProduct } from "./controller/useProduct/useUploadProduct";
import LoginWEmailDialog from "./components/Admin/LoginWEmailDialog";
import Headerbar from "./components/Admin/HeaderBar";
import UploadProductDialog from "./components/Admin/UploadProductDialog";
import UpdateProductDialog from "./components/Admin/UpdateProductDialog";
import Notification from "./components/Notification";
import ProductView from "./view/ProductView";
import { ADMIN_ORDER_TAB, ADMIN_PRODUCT_TAB } from "./strings";

function App() {
  const notify = Notification();

  const {
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
  } = useUploadProduct(notify.HandleOpenAlert);

  const {
    onSelectedNav,
    selectedNav,

    user,
    isLoggedIn,
    isOpenLogin,
    onOpenLogin,
    onCloseLogin,
    onChangeLoginData,
    onSignIn,
    onSignOut,
  } = useAppController(notify.HandleOpenAlert, onOpenUpload);

  const {
    addOnListUProduct,
    currAddOnUProduct,
    onChangeAddOnUProduct,
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
  } = useUpdateProduct(setCurrAddOnNewProduct, notify.HandleOpenAlert);

  let component = <div className="w-screen h-screen"></div>;

  const setProductViewComponent = () => {
    component = (
      <ProductView
        handleOpenAlert={notify.HandleOpenAlert}
        isLoggedIn={isLoggedIn}
        onOpenUpdate={onOpenUpdate}
        setUpdateProduct={setUpdateProduct}
      />
    );
  };

  const setOrderViewComponent = () => {
    // TODO: Implementation
  };

  if (isOpenLogin) {
    return (
      <>
        <LoginWEmailDialog
          isOpen={isOpenLogin}
          onChangeInput={onChangeLoginData}
          onClose={onCloseLogin}
          onLogin={onSignIn}
        />
        {notify.SnackBar}
      </>
    );
  }

  switch (selectedNav) {
    case ADMIN_PRODUCT_TAB:
      setProductViewComponent();
      break;
    case ADMIN_ORDER_TAB:
      setOrderViewComponent();
      break;
    default:
      setProductViewComponent();
      break;
  }

  const HeaderBarParamsValue = {
    onSelectedNav: onSelectedNav,
    selectedNav: selectedNav,
    user: user,
    onOpenLogin: onOpenLogin,
    onSignOut: onSignOut,
  };
  const HeaderBarParams = createContext(HeaderBarParamsValue);

  return (
    <>
      <HeaderBarParams.Provider value={HeaderBarParamsValue}>
        <Headerbar context={HeaderBarParams} />
      </HeaderBarParams.Provider>

      <div className="h-screen w-screen">
        <div className="w-[95%] flex flex-col justify-center m-4">
          <Typography variant="h5" sx={{ width: "100%", marginBottom: "1rem" }}>
            {selectedNav === ADMIN_PRODUCT_TAB ? "Product Data" : "Order data"}
          </Typography>
          {component}
        </div>
      </div>

      <UploadProductDialog
        isOpen={isOpenUpload}
        newProduct={newProduct}
        onChangeInput={onChangeNewProduct}
        onClose={onCloseUpload}
        onUploadProduct={onUploadProduct}
        inputHelperText={inputHelperText}
        addOnListNewProduct={addOnListNewProduct}
        currAddOn={currAddOnNewProduct}
        onChangeAddOn={onChangeAddOnNewProduct}
        onAddAddOns={onAddAddOnsNewProduct}
        onRemoveAddOn={onRemoveAddOnNewProduct}
        onSetProductImage={onSetProductImage}
      />
      <UpdateProductDialog
        isOpen={isOpenUpdate}
        uProduct={updateProduct}
        onChangeInput={onChangeUpdateProduct}
        onClose={onCloseUpdate}
        onUpdate={onUpdateProduct}
        onDelete={onDeleteProduct}
        addOnListUProduct={addOnListUProduct}
        currAddOn={currAddOnUProduct}
        onAddAddOns={onAddAddOnsUProduct}
        onChangeAddOn={onChangeAddOnUProduct}
        onRemoveAddOn={onRemoveAddOnUProduct}
        onSetUProductImage={onSetUProductImage}
      />
      {notify.SnackBar}
    </>
  );
}

export default App;
