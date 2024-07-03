import { Unsubscribe } from "firebase/firestore";
import useAddOnsModel from "../model/useAddOnsModel";
import useProductsModel, { UProduct } from "../model/useProductsModel";
import { PRODUCTS_STATUS } from "../status";

const useMenuViewModel = () => {
  const { listenProduct, getProductImageURL } = useProductsModel();
  const { listenAddOnsFromProduct } = useAddOnsModel();

  const listenProductVM = (
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

    return listenProduct(onReceivedProducts);
  };

  return { listenProductVM, listenAddOnsFromProduct };
};

export default useMenuViewModel;
