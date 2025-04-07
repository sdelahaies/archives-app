"use client";
import Image from "next/image";

const Description = ({ onChooseDB }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img src="/logo.png" alt="Logo" className="h-50 mb-4" />
      <p className="text-lg font-bold text-white">Select a file on the left panel</p>
    </div>
  );
};

export default Description;