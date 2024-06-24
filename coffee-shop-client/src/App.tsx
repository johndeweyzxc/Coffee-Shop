import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import useAppController from "./controller/useAppController";
import MenuView from "./view/MenuView";
import { ABOUT_PAGE, CART_PAGE, MENU_PAGE } from "./strings";
import CartsView from "./view/CartsView";

import AboutView from "./view/AboutView";
import Header from "./components/App/Header";
import LoginWGoogle from "./components/Login/LoginWGoogle";
import HomeView from "./view/HomeView";
import Footer from "./components/App/Footer";
import NavDrawer from "./components/App/NavDrawer";

function App() {
  const {
    currentPage,
    isLoggedIn,
    userId,
    userEmail,
    userPhotoUrl,
    onChangeCurrentPage,

    isOpenDrawer,
    onOpenDrawer,
    onCloseDrawer,

    isOpenLoginWGoogle,
    onOpenLoginWithGoogle,
    onCloseLoginWithGoogle,
    onSignInWithGoogle,
    onSignOutWithGoogle,
  } = useAppController();

  let component = <div className="w-screen h-screen"></div>;

  const setHomeViewComponent = () => {
    onCloseLoginWithGoogle();
    component = <HomeView onChangeCurrentPage={onChangeCurrentPage} />;
  };
  const setMenuViewComponent = () => {
    // TODO: Fix mechanism to allow smooth transition from signed in to signed out state
    if (!isLoggedIn) {
      onOpenLoginWithGoogle();
      return;
    } else {
      onCloseLoginWithGoogle();
    }
    component = <MenuView userId={userId === null ? "" : userId} />;
    if (currentPage !== MENU_PAGE) onChangeCurrentPage(MENU_PAGE);
  };
  const setCartViewComponent = () => {
    // TODO: Fix mechanism to allow smooth transition from signed in to signed out state
    if (!isLoggedIn) {
      onOpenLoginWithGoogle();
      return;
    } else {
      onCloseLoginWithGoogle();
    }
    component = <CartsView userId={userId === null ? "" : userId} />;
    if (currentPage !== CART_PAGE) onChangeCurrentPage(CART_PAGE);
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
    default:
      setHomeViewComponent();
      break;
  }

  return (
    <div className="w-screen h-screen">
      <Header
        selectedNav={currentPage}
        onChangeCurrentPage={onChangeCurrentPage}
        userEmail={userEmail}
        userPhotoUrl={userPhotoUrl}
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
        userEmail={userEmail}
        userPhotoUrl={userPhotoUrl}
        onSignIn={onSignInWithGoogle}
        onSignOut={onSignOutWithGoogle}
      />
    </div>
  );
}

export default App;
