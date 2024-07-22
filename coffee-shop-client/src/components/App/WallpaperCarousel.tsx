import { Carousel } from "react-bootstrap";
import BgImage1 from "../../assets/images/background-images/1.jpeg";
import BgImage2 from "../../assets/images/background-images/2.jpeg";
import BgImage3 from "../../assets/images/background-images/3.jpeg";

export default function WallpaperCarousel() {
  return (
    <Carousel
      className="m-0 p-0 w-screen h-screen fixed z-[-10]"
      controls={false}
      indicators={false}
      fade
    >
      <Carousel.Item>
        <img
          className="w-full h-full object-cover fixed"
          src={BgImage1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="w-full h-full object-cover fixed"
          src={BgImage2}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="w-full h-full object-cover fixed"
          src={BgImage3}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}
