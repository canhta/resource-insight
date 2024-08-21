import { getReportsByEmployee } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params: { id, slug } }: { params: { id: string; slug: string } }
) {
  if (slug === 'projects') {
    try {
      const dateOptions = ['2024-08-05', '2024-08-12', '2024-08-19']; // TODO: get from sheet
      const allRecords = await getReportsByEmployee(id, dateOptions);
      const data = allRecords.flat();

      if (!data) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(data);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Slug not found' }, { status: 404 });
}
