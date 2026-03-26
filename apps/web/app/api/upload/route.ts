import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const supabase = await createClient();
    
    const analyzedFiles = await Promise.all(files.map(async (file) => {
      let pageCount = 1;
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (fileExt === 'pdf') {
        try {
          const pdfDoc = await PDFDocument.load(buffer);
          pageCount = pdfDoc.getPageCount();
        } catch (e) {
          console.error(`Error reading PDF ${file.name}:`, e);
        }
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('print-files')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (error) throw error;

      return {
        originalName: file.name,
        filename: fileName,
        path: data.path, // path in supabase storage
        size: file.size,
        mimetype: file.type,
        pageCount: pageCount,
        printablePages: pageCount
      };
    }));

    return NextResponse.json({ files: analyzedFiles });
  } catch (error: any) {
    console.error('File Analysis Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze files' }, { status: 500 });
  }
}
