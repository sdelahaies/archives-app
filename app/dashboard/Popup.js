import React, { useEffect,useState } from "react";

const Popup = ({ 
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
}) => {

    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setPopupData(null);
        setCurrentLineIndex(null);
    };

// console.log(isUserAuthorized)

    const [isAuthorized,setIsAuthorized]=useState(false)
    useEffect(() => {
        setIsAuthorized(isUserAuthorized());
    }, );

    return (
        <div className="popup-overlay">
            {!isEditing ? (
                <div className="bg-black rounded-lg shadow-lg p-10 max-w-5xl relative flex flex-col items-center border"
                    style={{ minWidth: '50%' }}>
                    <button onClick={handleClosePopup} className="absolute top-0 right-1 text-gray-100 hover:text-red-300"
                        style={{ fontSize: '26px' }}>✖</button>
                    <button onClick={() => handleNavigation(-1)} className="absolute left-1 top-22 text-gray-100 hover:text-red-300 z-70"
                        style={{ fontSize: '26px' }}>◀</button>

                    <img src={imageSrc} alt="Cropped" className="mb-4 max-w-full max-h-96 w-full h-auto"/>
                    <p className="text-gray-100 text-center" style={{ fontSize: '26px' }}>{popupData.text}</p>

                    <button onClick={() => handleNavigation(1)} className="absolute right-1 top-22 text-gray-100 hover:text-red-300 z-70"
                        style={{ fontSize: '26px' }}>▶</button>

                    {isAuthorized && (
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 text-white rounded hover:bg-gray-500 border">
                                Edit
                            </button>
                            <button onClick={removeLine} className="mt-4 px-4 py-2 text-white rounded hover:bg-gray-500 border">
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-black rounded-lg shadow-lg p-6 max-w-4xl relative flex flex-col items-center"
                    style={{ minWidth: '50%' }}>
                    <img src={imageSrc} alt="Cropped" className="mb-4 max-w-full max-h-96 w-full h-auto" />
                    <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)}
                        className="w-full p-2 border rounded mb-2" />
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-white rounded hover:bg-gray-500 border">
                            Cancel
                        </button>
                        <button onClick={handleSaveEdit} className="px-4 py-2 text-white rounded hover:bg-gray-500 border">
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popup;
