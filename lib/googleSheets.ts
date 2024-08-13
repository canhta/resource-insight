import {
  BillableRange,
  EmployeesRange,
  HumanResourceSpreadsheetId,
  WeeklySummarySpreadsheetId,
} from '@/configs/sheets';
import { google } from 'googleapis';
import { toCamelCase } from './utils';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const getSheetData = async (spreadsheetId: string, range: string) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response.data.values as string[][];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getEmployees = async () => {
  const sheetData = await getSheetData(
    HumanResourceSpreadsheetId,
    EmployeesRange
  );
  const headers = sheetData[0].map(toCamelCase);

  return sheetData.slice(1).map((row) => {
    return headers.reduce((obj, header, index) => {
      if (header === 'coreSkills') {
        obj[header] = row[index].split(',').map((skill) => skill.trim());
      } else {
        obj[header] = row[index];
      }
      
      return obj;
    }, {} as { [key: string]: string | number | string[] });
  });
};

export const getReports = async (date: string, project?: string) => {
  const sheetRange = `${date}!A:E`;
  const sheetData = await getSheetData(WeeklySummarySpreadsheetId, sheetRange);
  const headers = sheetData[0].map(toCamelCase);

  const data = sheetData.slice(1).map((row) => {
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index];
      return obj;
    }, {} as { [key: string]: string | number | Record<string, number> });
  });

  if (project) {
    return data.filter((report) => report.project === project);
  }

  return data;
};

export const getBillable = async () => {
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
};

function convertStringToObject(input: string): { [key: string]: number } {
  const result: { [key: string]: number } = {};

  input.split(',').forEach((part) => {
    const [count, role] = part.trim().split(' ');
    result[role] = parseInt(count, 10);
  });

  return result;
}
