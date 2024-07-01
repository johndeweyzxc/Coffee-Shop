import { Unsubscribe } from "firebase/firestore";
import { UProduct } from "../model/api/products";
import useAddOnsModel from "../model/useAddOnsModel";
import useProductsModel from "../model/useProductsModel";
import { PRODUCTS_STATUS } from "../status";

const useMenuViewModel = () => {
  const { getProducts, getProductImageURL } = useProductsModel();
  const { listenAddOns } = useAddOnsModel();

  const getProductsVM = (
    onProducts: (products: UProduct[] | null, status: PRODUCTS_STATUS) => void
  ): Unsubscribe => {
    let listUProductVM: UProduct[] = [];
    let totalProducts: number | undefined = 0;
    let productsProcessed = 0;

    const createProductVM = (product: UProduct, status: PRODUCTS_STATUS) => {
      const onGotProductImageUrl = (url: string) => {
        const newUProductVM: UProduct = { ...product, ProductImageURL: url };
        listUProductVM = [...listUProductVM, newUProductVM];
        productsProcessed++;

        if (totalProducts === productsProcessed) {
          onProducts(listUProductVM, status);
          productsProcessed = 0;
        }
      };
      getProductImageURL(product.id, onGotProductImageUrl);
    };

    const onReceivedProducts = (
      products: UProduct[] | null,
      status: PRODUCTS_STATUS
    ) => {
      totalProducts = products?.length;
      listUProductVM = [];
      products?.forEach((product) => createProductVM(product, status));
    };

    return getProducts(onReceivedProducts);
  };

  return { getProductsVM, listenAddOns };
};

export default useMenuViewModel;
