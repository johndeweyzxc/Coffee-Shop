import { useEffect, useState } from "react";
import Notification from "../components/Notification";
import useMenuViewModel from "../viewmodel/useMenuViewModel";
import { useCartViewModel } from "../viewmodel/useCartViewModel";
import { Unsubscribe } from "firebase/firestore";
import { UProduct } from "../model/useProductsModel";
import { UAddOn } from "../model/useAddOnsModel";

const useMenuController = () => {
  const EMPTY_PRODUCT: UProduct = {
    id: "",
    Name: "",
    Description: "",
    Price: 0,
    ProductImageURL: "",
  };

  const { listenProductVM, listenAddOnsFromProduct } = useMenuViewModel();
  const { addToCartVM } = useCartViewModel();
  const notify = Notification();

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
      setTotalPrice(
        (prev) => 1 * (prev + parseInt(targetAddOn.Price as string))
      );
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
      setTotalPrice(
        (prev) => 1 * (prev - parseInt(targetAddOn.Price as string))
      );
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
    return listenAddOnsFromProduct(selectedProduct.id, onAddOns);
  };
  useEffect(() => {
    // TODO: Instead of attaching a listener, just fetch all addons
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenQuantity]);

  const onChangeQuantity = (isIncrement: boolean) => {
    if (!isIncrement) {
      if (quantity === 1) {
        return;
      } else if (quantity > 1) {
        setQuantity((prev) => (prev -= 1));
      }
    } else if (isIncrement) {
      setQuantity((prev) => (prev += 1));
    }
    if (isIncrement) {
      setTotalPrice((prev) => {
        console.log(prev, "+", selectedProduct.Price as number);
        return prev + (selectedProduct.Price as number);
      });
    } else {
      setTotalPrice((prev) => {
        console.log(prev, "-", selectedProduct.Price as number);
        return prev - (selectedProduct.Price as number);
      });
    }
  };
  const onAddToCart = (product: UProduct) => {
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
    const unsubscribeProduct = listenProductVM(onProducts);
    return () => {
      console.log("[useMenuController] Removing product listener");
      unsubscribeProduct();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alertSnackbar = notify.SnackBar;
  return {
    alertSnackbar,

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
