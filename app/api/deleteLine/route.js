import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function PUT(req) {
    try {
        const body = await req.json();
        const { dbdata,popupData } =body;

        const { data, error } = await supabase.from(dbdata.tables[0].table_pages)
        .select('*')
        .eq("filename", popupData.pagename)
        .eq("collection",popupData.collection)
        .eq("tag",popupData.tag)
        .single();

        if (error) {
            throw error;
        }  // Extract json_data and update the text for the specified id_line

        const JsonData = JSON.parse(data.data);

        // Remove the json_data entry with the specified id_line
        const updatedJsonData = JsonData.filter(line =>
            line.id_line !== popupData.idline
        );
        const updatedJsonString = JSON.stringify(updatedJsonData);


        // Update the row where filename and idline match
        const { data1, error1 } = await supabase
            .from(dbdata.tables[0].table_pages)  
            .update({ "data": updatedJsonString })
            .eq("filename", popupData.pagename)
            .eq("collection",popupData.collection)
            .eq("tag",popupData.tag)


        return NextResponse.json({ message: "Line Deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error updating text in inventaireMalte:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}