import { Typography } from "@mui/material";
import { MENU_PAGE } from "../strings";
import Background from "../assets/images/background-photo.jpeg";

interface HomePageProps {
  onChangeCurrentPage: (page: string) => void;
}
export default function HomeView(props: HomePageProps) {
  return (
    <div className="w-screen h-screen font-inter">
      <img
        alt="Coffee shop"
        src={Background}
        className="z-[-1] absolute w-full h-full object-cover"
      />
      <section className="w-full h-full flex justify-center items-center">
        <div className="w-[70%] h-auto flex flex-col justify-center items-start max-md:items-center max-md:w-[70%] max-sm:w-[90%]">
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
