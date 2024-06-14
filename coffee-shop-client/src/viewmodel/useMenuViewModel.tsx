import useAddOnsModel from "../model/useAddOnsModel";
import useAppAuthModel from "../model/useAppAuthModel";
import useProductsModel from "../model/useProductsModel";

const useMenuViewModel = () => {
  const { getProducts } = useProductsModel();
  const { isSignedIn, signInGoogle } = useAppAuthModel();
  const { getAddOns } = useAddOnsModel();
  return { isSignedIn, signInGoogle, getProducts, getAddOns };
};

export default useMenuViewModel;
