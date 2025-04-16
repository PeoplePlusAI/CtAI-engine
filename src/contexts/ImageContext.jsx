import { createContext, useContext, useState } from "react";

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imageData, setImageData] = useState({ file: null, preview: null });
  const [imageUploadResponse, setImageUploadResponse] = useState({
    filename: "",
    latitude: "",
    longitude: "",
    responseCode: 0,
    negativeComponents: "",
    actionableRecommendation: "",
  });

  return (
    <ImageContext.Provider
      value={{
        imageData,
        setImageData,
        imageUploadResponse,
        setImageUploadResponse,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};


export const useImage = () => useContext(ImageContext);
