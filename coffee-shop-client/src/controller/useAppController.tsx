import { useEffect, useState } from "react";
import { HOME_PAGE, MENU_PAGE } from "../strings";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
  SIGNOUT_STATUS,
} from "../status";
import useAppViewModel from "../viewmodel/useAppViewModel";
import { UProduct } from "../model/api/products";
import { User } from "firebase/auth";

const useAppController = () => {
  const { addAuthListener, removeAuthListener, signInGoogle, signOut } =
    useAppViewModel();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>("");
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>("");
  const [currentPage, setCurrentPage] = useState<string>(HOME_PAGE);
  const [products, setProducts] = useState<UProduct[]>([]);

  const onChangeCurrentPage = (page: string) => setCurrentPage(page);
  const onSetProducts = (products: UProduct[]) => setProducts(products);
  const setUserInfo = (user: User | null) => {
    if (user !== null) {
      setUserId(user?.uid);
      setUserEmail(user?.email);
      setUserPhotoUrl(user?.photoURL);
    }
  };
  const unsetUserInfo = () => {
    setUserId("");
    setUserEmail("");
    setUserPhotoUrl("");
  };

  const onSignInWithGoogle = () => {
    const onSignedIn = (
      user: User | null,
      status: LOGIN_WITH_GOOGLE_STATUS
    ) => {
      if (status === LOGIN_WITH_GOOGLE_STATUS.SUCCESS) {
        setIsLoggedIn(true);
        if (user !== null) {
          setUserInfo(user);
        }
      } else if (status === LOGIN_WITH_GOOGLE_STATUS.ERROR) {
        setIsLoggedIn(false);
        unsetUserInfo();
      }
    };
    signInGoogle(onSignedIn);
  };
  const onSignOutWithGoogle = () => {
    const onSignedOut = (status: SIGNOUT_STATUS) => {
      setIsLoggedIn(false);

      if (status === SIGNOUT_STATUS.SUCCESS) {
        // DO NOTHING HERE
      } else if (status === SIGNOUT_STATUS.ERROR) {
        // DO NOTHING HERE
      }
    };
    signOut(onSignedOut);
  };

  useEffect(() => {
    const cb = (user: User | null, status: AUTH_LISTENER_STATUS) => {
      if (status === AUTH_LISTENER_STATUS.LOGGED_IN) {
        setIsLoggedIn(true);
        if (user) {
          setUserInfo(user);
        } else {
          unsetUserInfo();
        }
      } else if (status === AUTH_LISTENER_STATUS.LOGGED_OUT) {
        unsetUserInfo();
      }
    };
    console.log("[useAppController] Adding auth listener");
    const unsubscribe = addAuthListener(cb);
    return () => {
      console.log("[useAppController] Removing auth listener");
      removeAuthListener(unsubscribe);
    };
  }, []);

  return {
    currentPage,
    isLoggedIn,
    userId,
    userEmail,
    userPhotoUrl,
    onChangeCurrentPage,
    onSignInWithGoogle,
    onSignOutWithGoogle,

    products,
    onSetProducts,
  };
};

export default useAppController;
