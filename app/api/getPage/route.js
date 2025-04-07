import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');
  // const collection = searchParams.get('collection');
  // const tag = searchParams.get('tag');
  // const DB_TABLE=`${collection}_pages_pred`; // will need to change that ! 
  const bucket = searchParams.get('bucket');
  
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filename);
    
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
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

