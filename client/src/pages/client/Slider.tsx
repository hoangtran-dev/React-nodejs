import { useEffect, useState } from "react";
import bannerImage1 from "../../assets/img/banner1.jpg";
import bannerImage2 from "../../assets/img/banner2.jpg";
import bannerImage3 from "../../assets/img/banner3.jpg";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bannerImage1, bannerImage2, bannerImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden relative w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transform transition-transform ${
              index === currentSlide ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 left-4">
        <button
          onClick={prevSlide}
          className="text-white bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        >
          &#8249;
        </button>
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
        <button
          onClick={nextSlide}
          className="text-white bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
        >
          &#8250;
        </button>
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full focus:outline-none ${
              index === currentSlide
                ? "bg-white shadow-md"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
