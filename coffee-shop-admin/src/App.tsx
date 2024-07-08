import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Typography } from "@mui/material";
import { createContext } from "react";

import ProductView from "./view/ProductView";
import LoginWEmailDialog from "./components/Admin/LoginWEmailDialog";
import Headerbar from "./components/Admin/HeaderBar";
import UploadProductDialog from "./components/Admin/UploadProductDialog";
import UpdateProductDialog from "./components/Admin/UpdateProductDialog";
import Notification from "./components/Notification";
import useAppController from "./controller/useApp/useAppController";
import useUpdateProduct from "./controller/useProduct/useUpdateProduct";
import { useUploadProduct } from "./controller/useProduct/useUploadProduct";
import { ADMIN_ORDER_TAB, ADMIN_PRODUCT_TAB } from "./strings";
import OrderView from "./view/OrderView";

function App() {
  const notify = Notification();

  const {
    inputHelperTextUpload,

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
    productImage,
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
    inputHelperTextUpdate,

    addOnListUProduct,
    currAddOnUProduct,
    onChangeAddOnUProduct,
    onRemoveAddOnUProduct,
    onAddAddOnsUProduct,
    onSetUProductImage,
    uProductImage,

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
    component = (
      <OrderView
        handleOpenAlert={notify.HandleOpenAlert}
        isLoggedIn={isLoggedIn}
      />
    );
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
        inputHelperText={inputHelperTextUpload}
        addOnListNewProduct={addOnListNewProduct}
        currAddOn={currAddOnNewProduct}
        onChangeAddOn={onChangeAddOnNewProduct}
        onAddAddOns={onAddAddOnsNewProduct}
        onRemoveAddOn={onRemoveAddOnNewProduct}
        onSetProductImage={onSetProductImage}
        productImage={productImage}
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
        productImage={uProductImage}
        inputHelperText={inputHelperTextUpdate}
      />
      {notify.SnackBar}
    </>
  );
}

export default App;
