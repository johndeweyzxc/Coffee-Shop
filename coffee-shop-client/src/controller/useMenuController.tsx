import { ChangeEvent, useEffect, useState } from "react";
import { UProduct } from "../model/api/products";
import Notification from "../components/Notification";
import useMenuViewModel from "../viewmodel/useMenuViewModel";
import { useCartViewModel } from "../viewmodel/useCartViewModel";
import { UAddOn } from "../model/api/addons";
import { Unsubscribe } from "firebase/firestore";

const useMenuController = () => {
  const EMPTY_PRODUCT: UProduct = {
    id: "",
    Name: "",
    Description: "",
    Price: 0,
  };

  const { isSignedIn, signInGoogle, getProducts, getAddOns } =
    useMenuViewModel();
  const { addToCartVM } = useCartViewModel();
  const notify = Notification();

  // * STATE MANAGEMENT FOR AUTHENTICATION
  // Use in dialog
  const [isOpenLoginWGoogle, setIsOpenLoginWGoogle] = useState<boolean>(false);

  const onOpenLoginWGoogle = () => setIsOpenLoginWGoogle(true);
  const onCloseLoginWGoogle = () => setIsOpenLoginWGoogle(false);
  const onLoginWithGoogle = () => {
    onCloseLoginWGoogle();
    signInGoogle(() => {});
  };

  // * STATE MANAGEMENT FOR ADDING A PRODUCT TO CART
  // Use in dialog
  const [isOpenQuantity, setIsOpenQuantity] = useState<boolean>(false);
  // Selected product by the user
  const [selectedProduct, setSelectedProduct] =
    useState<UProduct>(EMPTY_PRODUCT);
  // Total price of product multiplied by the quantity plus addons
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // Quantity of selected product
  const [quantity, setQuantity] = useState<number>(1);
  // Available addons from the selected product
  const [selectedProdAddOns, setSelectedProdAddOns] = useState<UAddOn[]>([]);
  // Addons selected by the user
  const [currentAddOns, setCurrentAddOns] = useState<UAddOn[]>([]);

  const onOpenQuantity = () => setIsOpenQuantity(true);
  const onCloseQuantity = () => {
    setSelectedProduct(EMPTY_PRODUCT);
    setTotalPrice(0);
    setQuantity(1);
    setSelectedProdAddOns([]);
    setCurrentAddOns([]);
    setIsOpenQuantity(false);
  };
  const onAddAddon = (addOnId: string) => {
    const targetAddOn = selectedProdAddOns.find(
      (uAddOn) => uAddOn.id === addOnId
    );
    const newSelectedProdAddOns = selectedProdAddOns.filter(
      (uAddOn) => uAddOn.id !== addOnId
    );
    if (targetAddOn !== undefined) {
      setTotalPrice((prev) => prev + parseInt(targetAddOn.Price as string));
      setCurrentAddOns((prev) => [...prev, targetAddOn]);
    }
    setSelectedProdAddOns(newSelectedProdAddOns);
  };
  const onRemoveAddon = (addOnId: string) => {
    const targetAddOn = currentAddOns.find((uAddOn) => uAddOn.id === addOnId);
    const newCurrentAddOns = currentAddOns.filter(
      (uAddOn) => uAddOn.id !== addOnId
    );
    if (targetAddOn !== undefined) {
      setTotalPrice((prev) => prev - parseInt(targetAddOn.Price as string));
      setSelectedProdAddOns((prev) => [...prev, targetAddOn]);
    }
    setCurrentAddOns(newCurrentAddOns);
  };
  const onGetAddOnsForSelectedProduct = (): Unsubscribe => {
    const onAddOns = (uAddOns: UAddOn[] | null) => {
      if (uAddOns === null) {
        notify.HandleOpenAlert("error", "Error fetching addons");
      } else {
        setSelectedProdAddOns(uAddOns);
      }
    };
    return getAddOns(selectedProduct.id, onAddOns);
  };
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (isOpenQuantity) {
      console.log(
        `[useMenuController] Adding addons listener for product ${selectedProduct.Name}`
      );
      unsubscribe = onGetAddOnsForSelectedProduct();
    } else {
      console.log(
        `[useMenuController] Removing addons listener for product ${selectedProduct.Name}`
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
  }, [isOpenQuantity]);

  const onChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (parseInt(value) < 0) return;
    setTotalPrice((selectedProduct.Price as number) * parseInt(value));
    setQuantity(parseInt(value));
  };
  const onAddToCart = (product: UProduct) => {
    if (!isSignedIn()) {
      onOpenLoginWGoogle();
      return;
    }
    onOpenQuantity();
    setTotalPrice(product.Price as number);
    setSelectedProduct(product);
  };
  const onQuantitySet = (userId: string) => {
    const onAddedToCart = (success: boolean) => {
      if (success) {
        notify.HandleOpenAlert("success", "Added to cart");
      } else {
        notify.HandleOpenAlert("error", "Failed to add to cart");
      }
    };
    onCloseQuantity();
    addToCartVM(
      userId,
      quantity,
      totalPrice,
      selectedProduct,
      currentAddOns,
      onAddedToCart
    );
  };

  // * STATE MANAGEMENT FOR RETRIEVING PRODUCTS
  // Products available
  const [products, setProducts] = useState<UProduct[]>([]);
  useEffect(() => {
    const onProducts = (products: UProduct[] | null) => {
      if (products === null) {
        notify.HandleOpenAlert("error", "Failed to fetched product data");
        return;
      }
      setProducts(products);
    };
    console.log("[useMenuController] Adding product listener");
    const unsubscribeProduct = getProducts(onProducts);
    return () => {
      console.log("[useMenuController] Removing product listener");
      unsubscribeProduct();
    };
  }, []);

  const alertSnackbar = notify.SnackBar;
  return {
    alertSnackbar,

    isOpenLoginWGoogle,
    onOpenLoginWGoogle,
    onCloseLoginWGoogle,
    onLoginWithGoogle,

    isOpenQuantity,
    onCloseQuantity,
    quantity,
    onChangeQuantity,
    onQuantitySet,
    selectedProduct,
    totalPrice,

    selectedProdAddOns,
    currentAddOns,
    onAddAddon,
    onRemoveAddon,

    products,
    onAddToCart,
  };
};

export default useMenuController;