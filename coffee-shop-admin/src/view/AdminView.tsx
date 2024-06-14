import { Box, Typography } from "@mui/material";
import Headerbar from "../components/Admin/HeaderBar";
import { useAdminController } from "../controller/useAdmin/useAdminController";
import { ADMIN_PRODUCT_TAB } from "../strings";
import { DataGrid } from "@mui/x-data-grid";
import UploadProductDialog from "../components/Admin/UploadProductDialog";
import UpdateProductDialog from "../components/Admin/UpdateProductDialog";
import LoginWEmailDialog from "../components/Admin/LoginWEmailDialog";

export default function AdminView() {
  const {
    inputHelperText,
    alertSnackbar,

    // * STATE MANAGEMENT INTERFACE FOR AUTHENTICATION
    isOpenLogin,
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
    onCloseUpload,
    newProduct,
    onChangeNewProduct,
    onUploadProduct,

    // * STATE MANAGEMENT INTERFACE FOR UPDATING PRODUCT
    addOnListUProduct,
    currAddOnUProduct,
    onChangeAddOnUProduct,
    onRemoveAddOnUProduct,
    onAddAddOnsUProduct,

    isOpenUpdate,
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
  } = useAdminController();

  if (isOpenLogin) {
    return (
      <>
        <LoginWEmailDialog
          isOpen={isOpenLogin}
          onClose={onCloseLogin}
          onChangeInput={onChangeLoginData}
          onLogin={onLoginAdmin}
        />
        {alertSnackbar}
      </>
    );
  }

  return (
    <>
      <Headerbar onSelectedNav={onSelectedNav} signOut={signOut} />
      <div className="w-[95%] flex flex-col justify-center m-4">
        <Typography variant="h5" sx={{ width: "100%", marginBottom: "1rem" }}>
          {selectedNav === ADMIN_PRODUCT_TAB ? "Product Data" : "Order data"}
        </Typography>
        <Box
          sx={{
            height: 500,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <DataGrid
            onRowClick={onProductClicked}
            rows={products}
            columns={productCol}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
          />
        </Box>
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
      />
      {alertSnackbar}
    </>
  );
}
