export const deleteLine = async (popupData) => {
    // console.log(data,line)
    // console.log('to delete', popupData)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deleteLine?filename=${popupData.linename}&idline=${popupData.idline}&collection=${popupData.collection}&tag=${popupData.tag}`, { cache: 'no-store' });
        return await response.json();
    } catch (error) {
        console.error("Error fetching line data:", error);
    }
};


export const deleteSample = async (dbdata, popupData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deleteSample`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dbdata, popupData })
        });

        const response_page = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deleteLine`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dbdata, popupData })
        });

        return response.ok, response_page
    } catch (error) {
        console.error("Error fetching line data:", error);
    }
};

export const fetchLineData = async (data, idline) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getLine?filename=${data.filename}&idline=${idline}&table=${data.tables[0].table_samples}&collection=${data.collection}&tag=${data.tag}`, { cache: 'no-store' });
        return await response.json();
    } catch (error) {
        console.error("Error fetching line data:", error);
    }
};

export const fetchLineImage = async (bucket, collection, linename) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getLineImage?linename=${linename}&bucket=${bucket}&collection=${collection}`, { cache: 'no-store' });
        return URL.createObjectURL(await response.blob());
    } catch (error) {
        console.error("Error fetching line image:", error);
    }
};

export const updateText = async (data, popupData, newText) => {
    try {
        const dbdata = data
        const response_sample = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateSample`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, popupData, newText })
        });


        const response_page = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateInventaire`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dbdata, popupData, newText })
        });
        return response_page.ok, response_sample.ok;
    } catch (error) {
        console.error("Error updating text:", error);
    }
};

export const updatePage = async (filename, idline, linename, newText, collection, tag) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateInventaire`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, idline, linename, newText, collection, tag })
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating text:", error);
    }
};


export const checkUserAuthorization = async () => {
    try {
        const response = await fetch('/api/checkAuth', { credentials: 'include' });
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data.isAuthorized;
    } catch (error) {
        console.error("Error checking authorization:", error);
        return false;
    }
};
