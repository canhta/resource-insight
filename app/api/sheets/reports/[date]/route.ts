import { WeeklySummarySpreadsheetId } from '@/configs/sheets';
import { getSheetData } from '@/lib/googleSheets';
import { toCamelCase } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { date: string } }
) {
  if (!params.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  const sheetRange = `${params.date}!A:E`;

  try {
    const sheetData = await getSheetData(
      WeeklySummarySpreadsheetId,
      sheetRange
    );

    const headers = sheetData[0].map(toCamelCase);

    const data = sheetData.slice(1).map((row) => {
      return headers.reduce((obj, header, index) => {
        obj[header] = row[index];
        return obj;
      }, {} as { [key: string]: string | number | Record<string, number> });
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
