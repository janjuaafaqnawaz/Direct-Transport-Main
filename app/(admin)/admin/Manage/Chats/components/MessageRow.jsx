import { BadgeAlert, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PhotoView } from "react-photo-view";

const MessageRow = ({ index, style, msg, rowHeights, listRef }) => {
  const rowRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (rowRef.current) {
      const newHeight = rowRef.current.getBoundingClientRect().height;
      if (rowHeights.current[index] !== newHeight) {
        rowHeights.current[index] = newHeight;
        listRef.current?.resetAfterIndex(index);
      }
    }
  }, [msg, showImage, imageError, isImageLoaded]);

  const handleImageError = () => {
    setImageError(true); // Set error state if the image fails to load
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true); // Set loaded state when the image loads successfully
  };

  return (
    <div ref={rowRef} style={{ ...style, height: "auto" }} className="w-full">
      <div
        className={`flex ${
          msg.sender === "admin" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md ${
            msg.sender === "admin"
              ? "bg-gray-800 text-gray-300"
              : "bg-[#349ae7] text-white"
          } rounded-lg p-3 shadow-lg`}
        >
          {msg.message === "#IMAGE" && msg.url ? (
            <>
              {!showImage ? (
                <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-700 rounded">
                  <button
                    onClick={() => setShowImage(true)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md"
                  >
                    View Image
                  </button>
                </div>
              ) : (
                <PhotoView src={msg.url}>
                  {imageError ? ( // Fallback if the image fails to load
                    <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-700 rounded">
                      <p className="text-white">Failed to load image</p>
                    </div>
                  ) : (
                    <>
                      {/* Use Next.js Image component with error handling */}
                      <Image
                        src={msg.url}
                        alt="Sent image"
                        width={250}
                        height={250}
                        className="h-[250px] w-[250px] rounded"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                      />
                      {/* Fallback to <img> if Next.js Image fails */}
                      {imageError && (
                        <img
                          src={msg.url}
                          alt="Sent image"
                          className="h-[250px] w-[250px] rounded"
                          onError={handleImageError}
                        />
                      )}
                    </>
                  )}
                </PhotoView>
              )}
            </>
          ) : (
            <p className="text-sm">{msg.message}</p>
          )}
          <p className="text-xs mt-1 opacity-70 flex flex-row items-center justify-between">
            {new Date(msg?.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
            <div className="ml-3">
              {msg?.seen === true ? (
                <BadgeCheck
                  size={15}
                  color={msg.sender === "admin" ? "#349ae7" : "white"}
                />
              ) : (
                <BadgeAlert size={15} />
              )}
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageRow;