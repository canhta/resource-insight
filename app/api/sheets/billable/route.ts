import { BillableRange, HumanResourceSpreadsheetId } from '@/configs/sheets';
import { getSheetData } from '@/lib/googleSheets';
import { toCamelCase } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sheetData: string[][] = await getSheetData(
      HumanResourceSpreadsheetId,
      BillableRange
    );

    const headers = sheetData[0].map(toCamelCase);

    // Convert to array of objects with headers as keys
    const data = sheetData.slice(1).map((row) => {
      return headers.reduce((obj, header, index) => {
        if (header === 'billable') {
          obj[header] = convertStringToObject(row[index]);
        } else {
          obj[header] = row[index];
        }
        return obj;
      }, {} as { [key: string]: string | number | Record<string, number> });
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function convertStringToObject(input: string): { [key: string]: number } {
  const result: { [key: string]: number } = {};

  input.split(',').forEach((part) => {
    const [count, role] = part.trim().split(' ');
    result[role] = parseInt(count, 10);
  });

  return result;
}
