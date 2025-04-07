"use client";
import React from "react";
import DynamicButtons from "./DynamicButtons";

const HomeView = ({ DbData,onChooseDB }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img src="/logo.png" alt="Logo" className="h-50 mb-4" />
      <DynamicButtons data={DbData} onChooseDB={onChooseDB}/>
    </div>
  );
};

export default HomeView;