import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const body = await req.json();
    const { data,popupData,newText } = body;

    // console.log(data)

    const { sample, error } = await supabase
    .from(data.tables[0].table_samples)  
    .update(
      {
         "text": newText,
         "pagename": popupData.pagename,
         "filename":popupData.linename,
         "tag":popupData.tag,
         "idline":popupData.idline,
         "collection":popupData.collection
        }
      ).eq('id',popupData.id);
    

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Update successful', sample }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
