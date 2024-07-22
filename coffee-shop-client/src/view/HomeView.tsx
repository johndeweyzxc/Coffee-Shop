import { Typography } from "@mui/material";

import WallpaperCarousel from "../components/App/WallpaperCarousel";
import { MENU_PAGE } from "../strings";
import "./styles/HomeView.css";

interface HomePageProps {
  onChangeCurrentPage: (page: string) => void;
}
export default function HomeView(props: HomePageProps) {
  const navigateToMenu = () => {
    window.location.href = `/${MENU_PAGE.toLowerCase()}`;
    props.onChangeCurrentPage(MENU_PAGE);
  };

  return (
    <main className="w-screen h-screen font-inter">
      <div className="w-screen h-screen bg-black fixed z-[-5] opacity-60" />
      <WallpaperCarousel />

      <section className="w-full h-full flex justify-center items-center">
        <div className="branding">
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontWeight: "600",
              marginBottom: ".5rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Coffee Shop App
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontWeight: "600",
              marginBottom: ".5rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Click the button below to view all available coffee
          </Typography>
          <button className="available-coffee" onClick={navigateToMenu}>
            Available coffee
          </button>
        </div>
      </section>
    </main>
  );
}
