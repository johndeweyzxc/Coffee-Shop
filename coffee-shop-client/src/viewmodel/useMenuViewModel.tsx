import useAddOnsModel from "../model/useAddOnsModel";
import useProductsModel from "../model/useProductsModel";

const useMenuViewModel = () => {
  const { getProducts } = useProductsModel();
  const { getAddOns } = useAddOnsModel();
  return { getProducts, getAddOns };
};

export default useMenuViewModel;
