// app/api/getPage/route.js
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const linename = searchParams.get('linename');
  const bucket = searchParams.get('bucket');
  const collection = searchParams.get('collection');
  // const DB_TABLE=`${collection}_samples_pred`;

  if (!linename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket) // Ensure this matches your actual bucket
      // .download(`${linename}`);
      .download(linename);
    
    if (error || !data) {
      throw error || new Error("File not found");
    }

    // Convert data to a Blob
    const arrayBuffer = await data.arrayBuffer();
    const contentType = 'image/jpeg'; // Adjust based on your image type

    return new Response(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${linename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
