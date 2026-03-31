import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `https://travelmatess.onrender.com${url}`;
  };

  // Extract URLs - prefer cover image first, then others
  const imageUrls = images
    .filter(img => img?.url) // skip invalid
    .sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0)) // cover first
    .map(img => getImageUrl(img.url));

  // Fallback if no images
  const fallbackImage = "/assets/images/default-package.jpg";

  if (imageUrls.length === 0) {
    return (
      <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg">No images available for this package</p>
          <p className="text-sm mt-2">Contact the agency for more details</p>
        </div>
      </div>
    );
  }

  const currentImage = imageUrls[currentIndex] || fallbackImage;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl bg-gray-900 group">
        <img
          src={currentImage}
          alt={`Package image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm opacity-70 hover:opacity-100"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm opacity-70 hover:opacity-100"
        >
          <ChevronRight size={28} />
        </button>

        {/* Fullscreen & Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-black/60 px-6 py-3 rounded-full text-white text-sm backdrop-blur-md">
          <span>{currentIndex + 1} / {imageUrls.length}</span>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 hover:text-blue-300 transition"
          >
            <Maximize2 size={18} />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {imageUrls.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {imageUrls.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 md:w-24 h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentIndex === index
                ? "border-blue-500 scale-105 shadow-md"
                : "border-transparent hover:border-gray-300 hover:scale-105"
                }`}
            >
              <img
                src={imgUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = fallbackImage; }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition"
          >
            <X size={40} />
          </button>

          <img
            src={currentImage}
            alt="Fullscreen view"
            className="max-w-[90%] max-h-[90%] object-contain"
            onError={(e) => { e.target.src = fallbackImage; }}
          />

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-8 bg-black/50 px-8 py-4 rounded-full text-white">
            <button onClick={prevImage}>
              <ChevronLeft size={32} />
            </button>
            <span className="text-lg font-medium">
              {currentIndex + 1} / {imageUrls.length}
            </span>
            <button onClick={nextImage}>
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;