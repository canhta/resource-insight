import { SHEETS_RANGE } from '@/configs/sheets';
import { appendData, getSheetData } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getSheetData(SHEETS_RANGE);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { values } = await request.json();
    const response = await appendData('Sheet1!A1:C1', [values]);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
