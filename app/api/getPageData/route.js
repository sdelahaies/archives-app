// app/api/getPageData/route.js
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');
  const table = searchParams.get('table')
  const collection = searchParams.get('collection');
  const tag = searchParams.get('tag');
  // const DB_TABLE="pages_exp"
 

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.from(`${table}`)
    .select("data")
    .eq("filename", `${filename}`)
    .eq('tag',`${tag}`)
    .eq('collection',`${collection}`)
    .single();
    
    if (error || !data) {
      throw error || new Error("File not found");
    }

    const jsondata = JSON.parse(data.data);

      return NextResponse.json(jsondata, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}