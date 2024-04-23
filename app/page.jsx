"use client";

import { useState } from "react";
import { GoUpload } from "react-icons/go";
import { MdOutlinePhotoCamera } from "react-icons/md";
import Navbar from "./components/Navbar";

export default function Home() {
  const [text, setText] = useState("");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleCameraOpen = () => {
    alert("Opening Camera...");
  };

  return (
    <div className="diagonal-gradient text-[#fff] flex items-center flex-col">
      <div className="w-[100vw]">
        <Navbar />
      </div>
      <div className=" flex flex-col justify-center items-center h-full w-full mt-[-100px]">
        <h1 className=" text-lg font-semibold pb-8">Visual Styling Studio</h1>
        <div className=" text-5xl font-extralight flex flex-col items-center gap-4 pb-20">
          <h3> Instantly Uncover Dream</h3>
          <h3> Fashion Treasures</h3>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <input
            className=" px-4 py-2 rounded-[4px] w-full md:w-[550px] relative"
            type="text"
            value={text}
            placeholder="Seach for Articles"
            onChange={handleTextChange}
          />

          <h1>or</h1>
          <div className="flex items-center gap-4">
            <label htmlFor="fileInput">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="border-[2px] p-2 rounded-md text-xl border-white"
              >
                <GoUpload />
              </button>
            </label>
            <button
              onClick={handleCameraOpen}
              className=" border-[2px] p-2 rounded-md text-xl border-white"
            >
              <MdOutlinePhotoCamera />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
