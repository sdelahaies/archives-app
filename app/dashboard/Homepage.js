"use client";

import React, { useEffect, useState } from "react";
import Viewer from "@/app/dashboard/Viewer";
import HomeBox from "./Home";
import "./globals2.css";

const HomePage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewerData, setViewerData] = useState(null);
  
  // Fetch filenames only on mount
  useEffect(() => {
    const fetchFilenames = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fileList`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch filenames");

        const data = await response.json();
        // console.log("your files",data)
        setFiles(data);
      } catch (error) {
        console.error("Error fetching filenames:", error);
      }
    };
    fetchFilenames();
  }, []);

  // Fetch full file data when a file is selected
  const handleFileSelect = async (filename) => {
    try { 
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getFile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      });
          
      if (!response.ok) throw new Error("Failed to fetch file data");

      const file = await response.json();
      const imageUrl = file.image_data
        ? `data:image/png;base64,${file.image_data}`
        : null;

      setViewerData({
        filename: file.filename,
        image: imageUrl,
        lines: file.json_data?.lines || [],
      });
      setSelectedFile(filename);
      // console.log(file.json_data)
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

  return (
    <div className="flex flex-grow overflow-hidden">
      {/* Sidebar for file list */}
      <div className="w-1/5 bg-black shadow-md flex-shrink-0 overflow-y-auto border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-l font-bold mb-4 text-white">Fichiers</h2>
          <div className="space-y-2 overflow-y-auto">
            {files.map((file) => (
              <button
                key={file._id}
                onClick={() => handleFileSelect(file.filename)}
                className={`block text-left py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 transition text-base border border-gray-300
                  ${selectedFile === file.filename ? "bg-gray-500 text-white" : "bg-black text-gray-100"}`}
                style={{ fontSize: '12px'}}
              >
                {file.filename}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="w-4/5 bg-black-50 flex justify-center items-center overflow-y-auto">
        {viewerData ? (
          // <Viewer data={viewerData} />
          <Viewer data={viewerData} onDataUpdate={() => handleFileSelect(viewerData.filename)} />

        ) : (
          <HomeBox/>
          // <p className="text-center text-gray-500">Select a fucking file to view</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
