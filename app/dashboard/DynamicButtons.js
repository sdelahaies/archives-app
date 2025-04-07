import React from "react";

const DynamicButtons = ({ data, onChooseDB }) => {
  // console.log(data)
  return (
    <div>
      {data.map(({ title,collection,tag,tables,buckets }) => (
        <div key={collection} className="mb-4">
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(tag) ? tag : [tag]).map((t) => (
              <button
                key={`${collection}-${t}`}
                className="bg-gray-700 text-white py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-300"
                onClick={() => onChooseDB(collection, t,tables[t], buckets[t],title)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicButtons;