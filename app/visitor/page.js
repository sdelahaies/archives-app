"use client";
import React, { useState, useEffect } from "react";
import Homepage from "@/app/dashboard/Homepage_supa";
import HomeBox from "@/app/dashboard/Home";
import Image from "next/image";


export default function Home() {
  const [selectedDB, setSelectedDB] = useState(null);
  const [DbData,setDbData] = useState([]);
  const onChooseDB = (collection, tag, tables, buckets,title) => {
    setSelectedDB({ collection, tag, tables, buckets,title });
  };

  const fetchDatabaseInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getSummary`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch database info");
  
      const data = await response.json();
      setDbData(data);
    } catch (error) {
      console.error("Error fetching database info:", error);
    }
  };
  useEffect(() => {
    fetchDatabaseInfo();

  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <nav className="bg-black-500 text-white p-2 pr-5 flex justify-between items-center">
        <div className="flex items-center">
          <a href="https://commanderiecondat.fr"> <img src="/logo.png" alt="Logo" className="h-12 mr-5" /></a>
          <span className="font-bold font-size:large mr-2">Commanderie de Condat - Confluence Hospitalière - Condat-sur-Vézère</span>
        </div>
        <div className="flex space-x-4">
          <a href="/dashboard" className="hover:underline">Home</a>
          <a href="/login" className="hover:underline">Log out</a>
          <a href="https://www.linkedin.com/company/commanderie-de-condat" >
            <Image
              aria-hidden
              src="/linkedin.svg"
              alt="Globe icon"
              width={25}
              height={25}
            />
          </a>
          <a href="https://github.com/CommanderieCondat/archive-app" >
            <Image
              aria-hidden
              src="/github-mark-white.svg"
              alt="Globe icon"
              width={25}
              height={25}
            />
          </a>
        </div>
      </nav>
      {selectedDB === null ? 
      ( 
        <HomeBox DbData={DbData} onChooseDB={onChooseDB} />
      ) : (
        <Homepage db={selectedDB} />
      )}
    </div>
  );
}
