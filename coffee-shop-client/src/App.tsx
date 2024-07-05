import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import useAuthController from "./controller/special/useAuthController";
import useAppController from "./controller/useAppController";
import HomeView from "./view/HomeView";
import MenuView from "./view/MenuView";
import CartsView from "./view/CartsView";
import OrdersView from "./view/OrdersView";
import AboutView from "./view/AboutView";
import Header from "./components/App/Header";
import LoginWGoogle from "./components/Login/LoginWGoogle";
import Footer from "./components/App/Footer";
import NavDrawer from "./components/App/NavDrawer";
import { ABOUT_PAGE, CART_PAGE, MENU_PAGE, ORDER_PAGE } from "./strings";

function App() {
  const {
    currentPage,
    onChangeCurrentPage,
    isOpenDrawer,
    onOpenDrawer,
    onCloseDrawer,
  } = useAppController();

  const {
    isLoggedIn,
    currentUser,
    isOpenLoginWGoogle,
    onOpenLoginWithGoogle,
    onCloseLoginWithGoogle,
    onSignInWithGoogle,
    onSignOutWithGoogle,
  } = useAuthController();

  let component = <div className="w-screen h-screen"></div>;

  const setHomeViewComponent = () => {
    onCloseLoginWithGoogle();
    component = <HomeView onChangeCurrentPage={onChangeCurrentPage} />;
  };
  const setMenuViewComponent = () => {
    if (!isLoggedIn) {
      onOpenLoginWithGoogle();
      return;
    } else {
      onCloseLoginWithGoogle();
    }
    component = <MenuView userId={currentUser.id} />;
    if (currentPage !== MENU_PAGE) onChangeCurrentPage(MENU_PAGE);
  };
  const setCartViewComponent = () => {
    if (!isLoggedIn) {
      onOpenLoginWithGoogle();
      return;
    } else {
      onCloseLoginWithGoogle();
    }
    component = <CartsView userId={currentUser.id} />;
    if (currentPage !== CART_PAGE) onChangeCurrentPage(CART_PAGE);
  };
  const setOrderViewComponent = () => {
    if (!isLoggedIn) {
      onOpenLoginWithGoogle();
    } else {
      onCloseLoginWithGoogle();
    }
    component = <OrdersView userId={currentUser.id} />;
    if (currentPage !== ORDER_PAGE) onChangeCurrentPage(ORDER_PAGE);
  };
  const setAboutViewComponent = () => {
    onCloseLoginWithGoogle();
    component = <AboutView />;
    if (currentPage !== ABOUT_PAGE) onChangeCurrentPage(ABOUT_PAGE);
  };

  switch (window.location.pathname) {
    case "/":
      setHomeViewComponent();
      break;
    case "/menu":
      setMenuViewComponent();
      break;
    case "/cart":
      setCartViewComponent();
      break;
    case "/about":
      setAboutViewComponent();
      break;
    case "/order":
      setOrderViewComponent();
      break;
    default:
      setHomeViewComponent();
      break;
  }

  return (
    <div className="w-screen h-screen">
      <Header
        selectedNav={currentPage}
        onChangeCurrentPage={onChangeCurrentPage}
        userEmail={currentUser.Email}
        userPhotoUrl={currentUser.PhotoURL}
        onSignOut={onSignOutWithGoogle}
        onSignIn={onSignInWithGoogle}
        onOpenDrawer={onOpenDrawer}
      />
      {component}
      <LoginWGoogle
        isOpen={isOpenLoginWGoogle}
        onLoginWithGoogle={onSignInWithGoogle}
        onClose={onCloseLoginWithGoogle}
      />
      <Footer />
      <NavDrawer
        isOpenDrawer={isOpenDrawer}
        onCloseDrawer={onCloseDrawer}
        userEmail={currentUser.Email}
        userPhotoUrl={currentUser.PhotoURL}
        onSignIn={onSignInWithGoogle}
        onSignOut={onSignOutWithGoogle}
      />
    </div>
  );
}

export default App;
