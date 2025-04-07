import React, { useState, useEffect, useRef } from "react";
import Popup from "./Popup";
import { fetchLineData, fetchLineImage, updateText, deleteLine,deleteSample,updatePage,checkUserAuthorization } from "@/utils/api";
import { isUserAuthorized } from "./Authentication";

const Viewer = ({ data, onDataUpdate }) => {
    const { collection,tag, filename, image, lines } = data;
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [popupData, setPopupData] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 1561, height: 2479 });
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState("");
    const [zoom, setZoom] = useState(1); // Zoom level
    const [transformOrigin, setTransformOrigin] = useState("center center"); // Zoom center
    const imageContainerRef = useRef(null); // Ref for image container

    const handleMouseOver = (index) => setHoveredIndex(index);
    const handleMouseOut = () => setHoveredIndex(null);

    useEffect(() => {
        setZoom(1);
        setTransformOrigin("center center");
    }, [filename]);

    useEffect(() => {
        if (!isPopupVisible) {
            setPopupData(null);
            setImageSrc(null);
        }
    }, [isPopupVisible]);

    useEffect(() => {
        if (image) {
            const img = new Image();
            img.src = image;
            img.onload = () => setImageSize({ width: img.width, height: img.height });
        }
    }, [image]);

    const handlePolygonClick = async (line) => {
        const dataPol = await fetchLineData(data, line.id_line);
        const imgSrc = await fetchLineImage(data.buckets[0].bucket_samples,data.collection,dataPol.linename);
        setPopupData(dataPol);
        setImageSrc(imgSrc);
        setIsPopupVisible(true);
        setCurrentLineIndex(line.id_line);
        setIsEditing(false);
        setEditedText(dataPol.text);
    };

    const handleSaveEdit = async () => {
        if (await updateText(data,popupData, editedText)){ 
            const dataPol = await fetchLineData(data, popupData.idline);            
            setPopupData(dataPol);
            setIsEditing(false);
            onDataUpdate();
        }
    };

    const removeLine = async () => {
        if (await deleteSample(data,popupData)) {
            onDataUpdate();
            setIsPopupVisible(false);
        }
    };

    const handleNavigation = (direction) => {
        const currentIndex = lines.findIndex(line => line.id_line === currentLineIndex);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < lines.length) {
            handlePolygonClick(lines[newIndex]);
        }
    };


    const handleWheelZoom = (event) => {
        event.preventDefault(); // Prevent page scroll

        if (!imageContainerRef.current) return;

        const zoomFactor = 0.1;
        const minZoom = 0.5;
        const maxZoom = 2.0;
        // Calculate new zoom level
        let newZoom = zoom - event.deltaY * zoomFactor * 0.01;
        newZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));
        // Get mouse position relative to the image container
        const rect = imageContainerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const percentX = (mouseX / rect.width) * 100;
        const percentY = (mouseY / rect.height) * 100;
        // Update transform origin to zoom at mouse pointer
        setTransformOrigin(`${percentX}% ${percentY}%`);
        setZoom(newZoom);
    };

    return (
        <div className="flex w-full h-[calc(100vh-80px)]">
            {/* Image Container */}
            <div
                ref={imageContainerRef}
                className="w-1/2 max-w-1/2 max-h-full flex justify-center items-center border-r relative"
                // className="w-1/2 overflow-auto max-h-full flex justify-center items-center border-r relative"
                onWheel={handleWheelZoom}
            >
                {image && (
                    <svg
                        className="max-h-full w-auto"
                        viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            transform: `scale(${zoom})`, // Apply zoom
                            transformOrigin, // Center zoom on mouse pointer
                        }}
                    >
                        <image href={image} height="100%" width="100%" />
                        {lines.map((line, index) => (
                            <polygon
                                key={index}
                                className={`textline ${hoveredIndex === index ? "highlighted" : ""}`}
                                points={line.polygon}
                                onMouseOver={() => setHoveredIndex(index)}
                                onMouseOut={() => setHoveredIndex(null)}
                                onClick={() => handlePolygonClick(line)}
                            />
                        ))}
                    </svg>
                )}
            </div>


            {/* Text Container */}
            <div className="w-1/2 overflow-y-auto max-h-full p-4">
                {lines.map((line, index) => (
                    <span
                        key={index}
                        className={`block my-1 ${hoveredIndex === index ? "highlighted" : ""}`}
                        onMouseOver={() => setHoveredIndex(index)}
                        onMouseOut={() => setHoveredIndex(null)}
                        onClick={() => handlePolygonClick(line)}
                    >
                        {line.text}
                    </span>
                ))}
            </div>


            {isPopupVisible && popupData && (
                <Popup {...{
                    imageSrc,
                    popupData,
                    setPopupData,
                    isEditing,
                    setIsEditing,
                    editedText,
                    setEditedText,
                    handleSaveEdit,
                    handleNavigation,
                    setCurrentLineIndex,
                    removeLine,
                    setIsPopupVisible,
                    isUserAuthorized
                }} />
            )}
        </div>
    );
};

export default Viewer;
