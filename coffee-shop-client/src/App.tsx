import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import useAppController from "./controller/useAppController";
import MenuView from "./view/MenuView";
import { ABOUT_PAGE, CART_PAGE, MENU_PAGE } from "./strings";
import CartsView from "./view/CartsView";

import Background from "./assets/images/background-photo.jpeg";
import AboutView from "./view/AboutView";
import { Typography } from "@mui/material";
import Header from "./components/App/Header";
import LoginWGoogle from "./components/Login/LoginWGoogle";

interface HomePageProps {
  onChangeCurrentPage: (page: string) => void;
}
function HomePage(props: HomePageProps) {
  return (
    <div className="w-screen h-screen font-inter">
      <img
        alt="Coffee shop"
        src={Background}
        className="z-[-1] absolute w-full h-full object-cover"
      />
      <section className="w-full h-full flex justify-center items-center">
        <div className="w-[70%] h-auto flex flex-col justify-center items-start max-md:w-[70%] max-sm:w-[90%]">
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontWeight: "600",
              marginBottom: "1rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Fun Shines On
          </Typography>
          <div
            className="px-5 py-1 border border-white border-solid text-white 
            font-semibold cursor-pointer hover:bg-[#ffffff20] ease-in-out duration-200 rounded-full
            font-inter"
            onClick={() => {
              window.location.href = `/${MENU_PAGE.toLowerCase()}`;
              props.onChangeCurrentPage(MENU_PAGE);
            }}
          >
            Discover the flavors
          </div>
        </div>
      </section>
    </div>
  );
}

function Footer() {
  return (
    <>
      <div className="h-[1px] bg-gray-400" />
      <div className="display flex items-center justify-end p-4">
        <p className="font-inter mr-8">
          © 2024 Coffee Shop Company. All rights reserved.
        </p>
      </div>
    </>
  );
}

function App() {
  const {
    currentPage,
    isLoggedIn,
    userId,
    userEmail,
    userPhotoUrl,
    onChangeCurrentPage,
    isOpenLoginWGoogle,
    onOpenLoginWithGoogle,
    onCloseLoginWithGoogle,
    onSignInWithGoogle,
    onSignOutWithGoogle,
  } = useAppController();

  let component = <div className="w-screen h-screen"></div>;

  const setHomeViewComponent = () => {
    onCloseLoginWithGoogle();
    component = <HomePage onChangeCurrentPage={onChangeCurrentPage} />;
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
      />
      {component}
      <LoginWGoogle
        isOpen={isOpenLoginWGoogle}
        onLoginWithGoogle={onSignInWithGoogle}
        onClose={onCloseLoginWithGoogle}
      />
      <Footer />
    </div>
  );
}

export default App;
