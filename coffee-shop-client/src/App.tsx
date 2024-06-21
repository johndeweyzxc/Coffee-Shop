import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import useAppController from "./controller/useAppController";
import MenuView from "./view/MenuView";
import { ABOUT_PAGE, CART_PAGE, HOME_PAGE, MENU_PAGE } from "./strings";
import CartsView from "./view/CartsView";
import HeaderBar from "./components/App/HeaderBar";
import Background from "./assets/images/background.jpg";
import StarbucksLogo from "./assets/images/starbucks-logo.png";
import { Avatar, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AboutView from "./view/AboutView";

interface HomePageHeaderProps {
  selectedNav: string;
  onChangeCurrentPage: (page: string) => void;
  userEmail: string | null;
  userPhotoUrl: string | null;
  onSignOutWithGoogle: () => void;
  onSignInWithGoogle: () => void;
}
function HomePageHeader(props: HomePageHeaderProps) {
  const navList = [HOME_PAGE, MENU_PAGE, CART_PAGE, ABOUT_PAGE];

  const SignedInUser = () => {
    const ProfilePicture = () => {
      if (props.userPhotoUrl !== null) {
        return (
          <Avatar
            alt="User profile"
            src={props.userPhotoUrl}
            sx={{ marginRight: ".5rem" }}
          />
        );
      }
      const firstLetter = props.userEmail?.charAt(0);
      return (
        <Avatar sx={{ bgcolor: "green", marginRight: ".5rem" }}>
          {firstLetter}
        </Avatar>
      );
    };

    return (
      <div className="ml-4 mr-8 text-white flex items-center">
        <ProfilePicture />
        {props.userEmail === "" ? "Guest" : props.userEmail}
      </div>
    );
  };

  const SignOutOrInButton = () => {
    if (props.userEmail === "") {
      return (
        <p
          className="mr-8 text-white font-inter text-[1rem] 
          font-semibold hover:text-green-500 ease-in-out 
          duration-300 cursor-pointer"
          onClick={props.onSignInWithGoogle}
        >
          Sign in
        </p>
      );
    }
    return (
      <p
        className="mr-8 text-white font-inter text-[1rem] 
        font-semibold hover:text-green-500 ease-in-out 
        duration-300 cursor-pointer"
        onClick={props.onSignOutWithGoogle}
      >
        Sign out
      </p>
    );
  };

  return (
    <>
      <div className="p-8 ml-44 absolute bg-white">
        <img alt="Starbucks logo" src={StarbucksLogo} className="w-24" />
      </div>
      <div className="w-full flex justify-end items-center p-8 pr-32">
        {navList.map((nav, index) => {
          if (props.selectedNav === nav) {
            return (
              <p
                className="mr-8 text-green-400 font-inter text-[1rem] 
                font-semibold cursor-pointer"
                key={index}
                onClick={() => {
                  props.onChangeCurrentPage(nav);
                  if (nav === HOME_PAGE) {
                    window.location.href = "/";
                    return;
                  }
                  window.location.href = `/${nav.toLowerCase()}`;
                }}
              >
                {nav}
              </p>
            );
          }

          return (
            <p
              className="mr-8 text-white font-inter text-[1rem] 
              font-semibold hover:text-green-500 ease-in-out 
              duration-300 cursor-pointer"
              key={index}
              onClick={() => {
                props.onChangeCurrentPage(nav);
                if (nav === HOME_PAGE) {
                  window.location.href = "/";
                  return;
                }
                window.location.href = `/${nav.toLowerCase()}`;
              }}
            >
              {nav}
            </p>
          );
        })}
        <div className="text-white">|</div>
        <SignedInUser />
        <SignOutOrInButton />
      </div>
    </>
  );
}

interface HomePageProps {
  currentPage: string;
  onChangeCurrentPage: (page: string) => void;
  userEmail: string | null;
  userPhotoUrl: string | null;
  onSignOutWithGoogle: () => void;
  onSignInWithGoogle: () => void;
}
function HomePage(props: HomePageProps) {
  return (
    <div className="w-screen h-screen font-inter">
      <img
        alt="Starbucks coffee shop"
        src={Background}
        className="z-[-1] absolute w-full h-full object-cover"
      />
      <div className="absolute w-screen h-screen z-[-1] bg-black/60" />
      <HomePageHeader
        selectedNav={props.currentPage}
        onChangeCurrentPage={props.onChangeCurrentPage}
        userEmail={props.userEmail}
        userPhotoUrl={props.userPhotoUrl}
        onSignOutWithGoogle={props.onSignOutWithGoogle}
        onSignInWithGoogle={props.onSignInWithGoogle}
      />
      <section className="w-full h-full flex justify-center items-center">
        <div className="w-[70%] h-auto flex flex-col justify-center items-start max-md:w-[70%] max-sm:w-[90%]">
          <Typography
            variant="h6"
            sx={{
              color: "green",
              marginBottom: "1rem",
              fontFamily: "Inter, sans-serif",
              fontWeight: "bold",
            }}
          >
            A real itallian cafe
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: "600",
              marginBottom: "1rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Discover the taste
            <br />
            of real coffee
          </Typography>
          <div
            className="p-2 px-8 border border-green-400 border-solid text-white 
            font-semibold cursor-pointer hover:bg-green-400 ease-in-out duration-300 
            font-inter"
            onClick={() => {
              window.location.href = `/${MENU_PAGE.toLowerCase()}`;
              props.onChangeCurrentPage(MENU_PAGE);
            }}
          >
            Menu
            <KeyboardArrowRightIcon sx={{ marginLeft: ".25rem" }} />
          </div>
        </div>
      </section>
    </div>
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
    onSignInWithGoogle,
    onSignOutWithGoogle,
  } = useAppController();

  let component = <MenuView userId={userId === null ? "" : userId} />;
  const setHomeViewComponent = () => {
    component = (
      <HomePage
        currentPage={currentPage}
        onChangeCurrentPage={onChangeCurrentPage}
        userEmail={userEmail}
        userPhotoUrl={userPhotoUrl}
        onSignInWithGoogle={onSignInWithGoogle}
        onSignOutWithGoogle={onSignOutWithGoogle}
      />
    );
  };
  const setMenuViewComponent = () => {
    // TODO: Check if a user is currently logged in
    component = <MenuView userId={userId === null ? "" : userId} />;
    if (currentPage !== MENU_PAGE) onChangeCurrentPage(MENU_PAGE);
  };
  const setCartViewComponent = () => {
    // TODO: Check if a user is currently logged in
    component = <CartsView userId={userId === null ? "" : userId} />;
    if (currentPage !== CART_PAGE) onChangeCurrentPage(CART_PAGE);
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
    default:
      setHomeViewComponent();
      break;
  }

  if (window.location.pathname === "/") {
    return component;
  }

  // TODO: Fix the header bar
  return (
    <>
      <HeaderBar
        isLoggedIn={isLoggedIn}
        currentPage={currentPage}
        signInWithGoogle={onSignInWithGoogle}
        signOutWithGoogle={onSignOutWithGoogle}
      />
      {component}
    </>
  );
}

export default App;
