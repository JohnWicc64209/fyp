"use client";
import React, { useState, useRef } from "react";
import { GoUpload } from "react-icons/go";
import { MdOutlinePhotoCamera } from "react-icons/md";
import Navbar from "./components/Navbar";
import Clarifai from "clarifai";

const clarifaiApp = new Clarifai.App({
  apiKey: "7f7d12ed2d5b4b67848578bb9357d7f4", // Your PAT
});

const modelID = "vss-image-recognition"; // Your selected model ID
const modelVersionID = "75563136442945bc881d02190ca3b756"; // Your selected model version ID

function Home() {
  const [image, setImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setImage(URL.createObjectURL(file));
        const base64Image = await getBase64(file);
        setIsLoading(true);

        try {
          // Send the image to Clarifai for processing
          const clarifaiResponse = await clarifaiApp.models.predict(
            { id: modelID, version: modelVersionID },
            { base64: base64Image }
          );
          console.log("Clarifai response:", clarifaiResponse);

          if (
            !clarifaiResponse.outputs ||
            !clarifaiResponse.outputs[0].data.concepts
          ) {
            throw new Error("Clarifai response is not as expected");
          }

          const concepts = clarifaiResponse.outputs[0].data.concepts;
          const matchedProducts = concepts.map((concept) => {
            // Log the entire concept object to inspect its structure
            console.log("Concept:", concept);

            // Since metadata is not present, create default values
            const link = concept.link || "#"; // Use a property from concept or a default link
            const title = concept.name || "Default Title"; // Use a property from concept or a default title

            // Log the link and title
            console.log("Link:", link);
            console.log("Title:", title);

            return {
              image: URL.createObjectURL(file), // Using the uploaded image as the display image
              title, // Fallback to a default title if not found
              link, // Fallback to a default link if not found
            };
          });

          // Check the resulting matchedProducts array
          console.log("Matched Products:", matchedProducts);

          // Check the resulting matchedProducts array
          console.log("Matched Products:", matchedProducts);

          setSimilarProducts(matchedProducts);
          setIsLoading(false);
        } catch (error) {
          console.error("Error finding similar products:", error);
          setError(
            "Error finding similar products. Please try a different image."
          );
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Error finding similar products. Please try a different image.");
      setIsLoading(false);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCameraOpen = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((error) => {
        console.error("Error opening camera:", error);
      });
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const dataURL = canvasRef.current.toDataURL("image/png");
    setImage(dataURL);

    setIsCameraOpen(false);
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  return (
    <div className="diagonal-gradient text-[#fff] flex items-center flex-col min-h-screen">
      <div className="w-[100vw]">
        <Navbar />
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-[100px]">
        <h1 className="text-lg font-semibold pb-8">Visual Styling Studio</h1>
        <div className="text-5xl font-extralight flex flex-col items-center gap-4 pb-20">
          <h3> Instantly Uncover Dream</h3>
          <h3> Fashion Treasures</h3>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            type="button"
            className="border-[2px] p-2 rounded-md text-xl border-white"
            onClick={handleUploadClick}
          >
            <GoUpload />
          </button>
          <button
            onClick={handleCameraOpen}
            className="border-[2px] p-2 rounded-md text-xl border-white"
          >
            <MdOutlinePhotoCamera />
          </button>
        </div>
        {image && (
          <div>
            <img src={image} alt="Uploaded" className="mt-4 w-64 h-auto" />
            {isLoading && <p>Scanning image, please wait...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {similarProducts.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map((product, index) => (
                  <div
                    key={index}
                    className="card"
                    onClick={() => window.open(product.link, "_blank")}
                  >
                    <img src={product.image} alt={product.title} />
                    <p>{product.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {isCameraOpen && (
          <div className="camera-container">
            <video ref={videoRef} className="camera-view" />
            <button
              onClick={handleCapture}
              className="border-[2px] p-2 rounded-md text-xl border-white"
            >
              Capture Photo
            </button>
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
              width="640"
              height="480"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
