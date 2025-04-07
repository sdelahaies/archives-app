import { supabase } from '@/lib/supabaseClient';
import { NextResponse} from 'next/server';


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get('table');
  const collection = searchParams.get('collection');
  const tag = searchParams.get('tag');
   
    const { data, error } = await supabase
      .from(table)
      .select('filename')
      .eq('tag',tag)
      .eq('collection',collection)
      .order('filename', { ascending: true });
    if (error) {
      throw error;
    }
    return NextResponse.json(data);
}