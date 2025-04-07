import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { dbdata,popupData } =body;
    const { data, error } = await supabase
      .from(dbdata.tables[0].table_samples)  
      .delete()
      .eq('linename', popupData.linename)
      .eq('tag',popupData.tag)
      .eq('idline', popupData.collection);

    return NextResponse.json({ error: 'All good!!' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

