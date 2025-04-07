import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

const transformData = (data) => {
  return Object.values(
    data.reduce((acc, { collection, tag, title, table_pages, table_samples, bucket_pages, bucket_samples, description, model }) => {
      if (!acc[collection]) {
        acc[collection] = { 
          collection, 
          title, 
          tag: [], 
          tables: {}, 
          buckets: {} 
        };
      } else {
        acc[collection].title = title;
      }

      // Add tag to the existing tags array
      if (!acc[collection].tag.includes(tag)) {
        acc[collection].tag.push(tag);
      }

      // Ensure the tag array exists in the tables object
      if (!acc[collection].tables[tag]) {
        acc[collection].tables[tag] = [];
      }

      // Add table data to tables object
      if (table_pages && table_samples) {
        acc[collection].tables[tag].push({
          'table_pages': table_pages,
          'table_samples': table_samples
        });
      }

      // Ensure the tag array exists in the buckets object
      if (!acc[collection].buckets[tag]) {
        acc[collection].buckets[tag] = [];
      }

      // Add bucket data to buckets object
      if (bucket_pages && bucket_samples) {
        acc[collection].buckets[tag].push({
          'bucket_pages': bucket_pages,
          'bucket_samples': bucket_samples
        });
      }

      return acc;
    }, {})
  );
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from(process.env.ARCHIVES_DB)
      .select('*');

    if (error) {
      throw error;
    }
    // console.log(data)
    const transformedData = transformData(data);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching database info:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}