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
import NavigationBar from "./components/App/NavigationBar";
import NavigationDrawer from "./components/App/NavigationDrawer";
import RegisterDialog from "./components/App/RegisterDialog";
import LoginDialog from "./components/App/LoginDialog";
import { ABOUT_PAGE, CART_PAGE, MENU_PAGE, ORDER_PAGE } from "./strings";
import Notification from "./components/Notification";

function App() {
  const notification = Notification();

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
    onSignInWithGoogle,
    onLogOut,

    isOpenUserLogin,
    onOpenLogin,
    loginUserInfo,
    onChangeLogin,
    onCloseLogin,
    onLogInUsingEmailAndPassword,

    isOpenUserRegister,
    onOpenRegistration,
    registerUser,
    onChangeRegister,
    onCloseRegistration,
    onRegisterUsingEmailAndPassword,

    inputHelperText,
  } = useAuthController(notification.HandleOpenAlert);

  let component = <div className="w-screen h-screen"></div>;

  const setHomeViewComponent = () => {
    component = <HomeView onChangeCurrentPage={onChangeCurrentPage} />;
  };
  const setMenuViewComponent = () => {
    component = (
      <MenuView
        userId={currentUser.id}
        isLoggedIn={isLoggedIn}
        onCloseLogin={onCloseLogin}
        onOpenLogin={onOpenLogin}
      />
    );
    if (currentPage !== MENU_PAGE) onChangeCurrentPage(MENU_PAGE);
  };
  const setCartViewComponent = () => {
    isLoggedIn === false ? onOpenLogin() : onCloseLogin();
    if (isLoggedIn) {
      component = <CartsView userId={currentUser.id} />;
      if (currentPage !== CART_PAGE) onChangeCurrentPage(CART_PAGE);
    }
  };
  const setOrderViewComponent = () => {
    isLoggedIn === false ? onOpenLogin() : onCloseLogin();
    if (isLoggedIn) {
      component = <OrdersView userId={currentUser.id} />;
      if (currentPage !== ORDER_PAGE) onChangeCurrentPage(ORDER_PAGE);
    }
  };
  const setAboutViewComponent = () => {
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
      <NavigationBar
        selectedNav={currentPage}
        onChangeCurrentPage={onChangeCurrentPage}
        userEmail={currentUser.Email}
        userPhotoUrl={currentUser.PhotoURL}
        onOpenRegister={onOpenRegistration}
        onLogOut={onLogOut}
        onOpenSignIn={onOpenLogin}
        onOpenDrawer={onOpenDrawer}
      />
      {component}
      <LoginDialog
        isOpenUserLogin={isOpenUserLogin}
        onSignInWithGoogle={onSignInWithGoogle}
        onOpenRegistration={onOpenRegistration}
        onChangeLogin={onChangeLogin}
        loginUserInfo={loginUserInfo}
        onCloseLogin={onCloseLogin}
        onLogInUsingEmailAndPassword={onLogInUsingEmailAndPassword}
        inputHelperText={inputHelperText}
      />
      <RegisterDialog
        isOpenUserRegister={isOpenUserRegister}
        onChangeRegister={onChangeRegister}
        onCloseRegistration={onCloseRegistration}
        onRegisterUsingEmailAndPassword={onRegisterUsingEmailAndPassword}
        registerUser={registerUser}
        onOpenLogin={onOpenLogin}
        inputHelperText={inputHelperText}
        onSignInWithGoogle={onSignInWithGoogle}
      />
      <NavigationDrawer
        isOpenDrawer={isOpenDrawer}
        onCloseDrawer={onCloseDrawer}
        userEmail={currentUser.Email}
        userPhotoUrl={currentUser.PhotoURL}
        onChangeCurrentPage={onChangeCurrentPage}
        onOpenLogin={onOpenLogin}
        onLogOut={onLogOut}
      />
      {notification.SnackBar}
    </div>
  );
}

export default App;
