"use client";

import React, { useEffect, useState } from "react";
import Viewer from "@/app/dashboard/Viewer_new";
import Description from "./Description";
import "./globals.css";

const HomePage = ({ db }) => {
  const [pages, setPages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewerData, setViewerData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  // Fetch filenames only on mount
  useEffect(() => {
    const fetchPagesFilenames = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fetchdb?table=${db.tables[0].table_pages}&collection=${db.collection}&tag=${db.tag}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch filenames");
        const data = await response.json();
        setPages(data);
      } catch (error) {
        console.error("Error fetching filenames:", error);
      }
    };
    fetchPagesFilenames();
  }, []);

  // Fetch full file data when a file is selected
  const handleFileSelect = async (filename) => {
    try { 
      // console.log("you should see me!!!")
      setSelectedFile(filename);
      const response_page = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getPage?filename=${filename}&bucket=${db.buckets[0].bucket_pages}`,
        { cache: 'no-store' }
      );
      if (!response_page.ok) throw new Error('Failed to fetch image');
      const blob = await response_page.blob();
      const objectURL = URL.createObjectURL(blob);
      const response_data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getPageData?filename=${filename}&table=${db.tables[0].table_pages}&collection=${db.collection}&tag=${db.tag}`,
        { cache: 'no-store' }
      );

      if (!response_data.ok) throw new Error('Failed to fetch image');
      const jsondata = await response_data.json();

      setViewerData({
        tables:db.tables,
        buckets:db.buckets,
        collection:db.collection,
        tag:db.tag,
        filename: filename,
        image: objectURL,
        lines: jsondata,
      });
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

  return (
    <div className="flex flex-grow overflow-hidden">
      {/* Sidebar for file list */}
      <div className="w-1/5 bg-black shadow-md flex-shrink-0 overflow-y-auto border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-l font-bold mb-4 text-white">{db.title}: {db.tag}</h2>
          <div className="space-y-2 overflow-y-auto">
            {pages.map((page) => (
              <button
                key={page.filename}
                onClick={() => handleFileSelect(page.filename)}
                className={`block text-left px-4 rounded-md shadow-sm hover:bg-gray-700 transition text-base
                  ${selectedFile === page.filename ? "bg-gray-500 text-white" : "bg-black text-gray-100"}`}                
                style={{ fontSize: '12px'}}
              >
                {page.filename}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="w-4/5 bg-black-50 flex justify-center items-center overflow-y-auto">
        {viewerData ? (
          <Viewer data={viewerData} onDataUpdate={() => {
            handleFileSelect(viewerData.filename)
          }} />
        ) : (
          <Description/>
        )}
      </div>
    </div>
  );
};

export default HomePage;
