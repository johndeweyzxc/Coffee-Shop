import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";
import { GridColDef, GridEventListener } from "@mui/x-data-grid";

import { UProduct } from "../../model/useProductsModel";
import useAdminViewModel from "../../viewmodel/useAdminViewModel";

export const useGetProduct = (
  isLoggedIn: boolean,
  setUpdateProduct: (value: React.SetStateAction<UProduct>) => void,
  onOpenUpdate: () => void,
  handleOpenAlert: (severity: string, message: string) => void
) => {
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

  const { listenProductsVM } = useAdminViewModel();

  // * STATE MANAGEMENT FOR RETRIEVING PRODUCTS
  // Available products
  const [products, setProducts] = useState<UProduct[]>([]);

  const onProductClicked: GridEventListener<"rowClick"> = (params) => {
    setUpdateProduct(params.row);
    onOpenUpdate();
  };
  useEffect(() => {
    let unsubscribeProduct: Unsubscribe | null = null;
    const onProducts = (products: UProduct[] | null) => {
      if (products === null) {
        handleOpenAlert("error", "Failed to fetched product data");
      } else {
        setProducts(products);
      }
    };
    if (isLoggedIn) {
      console.log("[useAdminController] Adding product listener");
      unsubscribeProduct = listenProductsVM(onProducts);
    } else {
      setProducts([]);
    }
    return () => {
      console.log("[useAdminController] Removing product listener");
      if (unsubscribeProduct !== null) unsubscribeProduct();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return { products, productCol, onProductClicked };
};
