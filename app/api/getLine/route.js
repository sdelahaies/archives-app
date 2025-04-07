// app/api/getPageData/route.js
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');
    const idline = searchParams.get('idline');
    const collection = searchParams.get('collection');
    const tag = searchParams.get('tag');
    // const DB_TABLE=`samples_exp`;
    const DB_TABLE=searchParams.get('table');

    if (!filename) {
        return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    try {

        const { data, error } = await supabase.from(DB_TABLE)
        .select("*")
        .eq("pagename", filename)
        .eq("idline", idline)
        .eq('tag',tag)
        .eq('collection',collection)
        .single();
        if (error || !data) {
            throw error || new Error("File not found");
        }
        const lineData = {
            linename: data.filename,
            pagename: data.pagename,
            idline: data.idline,
            text: data.text,
            collection: data.collection,
            tag:data.tag,
            id:data.id
        };
        return NextResponse.json(lineData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}