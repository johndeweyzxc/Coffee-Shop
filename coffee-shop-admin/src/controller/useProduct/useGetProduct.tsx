import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";
import { GridColDef, GridEventListener } from "@mui/x-data-grid";

import useAdminViewModel, {
  UProductVM,
} from "../../viewmodel/useAdminViewModel";
import { UProduct } from "../../model/api/products";
import { PRODUCTS_STATUS } from "../../status";

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

  const { getProductsVM } = useAdminViewModel();

  const [products, setProducts] = useState<UProductVM[]>([]);

  const onProductClicked: GridEventListener<"rowClick"> = (params) => {
    setUpdateProduct(params.row);
    onOpenUpdate();
  };

  useEffect(() => {
    let unsubscribeProduct: Unsubscribe | null = null;

    const onProducts = (
      products: UProductVM[] | null,
      status: PRODUCTS_STATUS
    ) => {
      if (status === PRODUCTS_STATUS.FETCHED) {
        setProducts(products!);
      } else if (status === PRODUCTS_STATUS.PERMISSION_ERROR) {
        // DO NOTHING HERE
      } else if (status === PRODUCTS_STATUS.ERROR) {
        handleOpenAlert("error", "Failed to fetched product data");
      }
    };

    if (isLoggedIn) {
      console.log("[useAdminController] Adding product listener");
      unsubscribeProduct = getProductsVM(onProducts);
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
