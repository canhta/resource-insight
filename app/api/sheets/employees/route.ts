import { EmployeesRange, HumanResourceSpreadsheetId } from '@/configs/sheets';
import { getSheetData } from '@/lib/googleSheets';
import { Employee } from '@/lib/types';
import { toCamelCase } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sheetData = await getSheetData(
      HumanResourceSpreadsheetId,
      EmployeesRange
    );

    const headers = sheetData[0].map(toCamelCase) as (keyof Employee)[];

    const data = sheetData.slice(1).map((row) => {
      return headers.reduce((obj, header, index) => {
        if (header === 'coreSkills') {
          obj[header] = row[index].split(',').map((skill) => skill.trim());
        } else {
          obj[header] = row[index];
        }

        return obj;
      }, {} as Employee);
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
