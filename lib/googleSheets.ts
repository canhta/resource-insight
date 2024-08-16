import {
  EmployeesRange,
  HumanResourceSpreadsheetId,
  ProjectsRange,
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
      if (header === 'coreSkills' || header === 'domains') {
        obj[header] = row[index].split(',').map((item) => item.trim());
      } else {
        obj[header] = row[index];
      }

      return obj;
    }, {} as { [key: string]: string | number | string[] });
  });
};

export const getReports = async (date: string) => {
  const sheetRange = `${date}!A:F`;
  const sheetData = await getSheetData(WeeklySummarySpreadsheetId, sheetRange);
  const headers = sheetData[0].map(toCamelCase);

  return sheetData.slice(1).map((row) => {
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index];
      return obj;
    }, {} as { [key: string]: string | number | Record<string, number> });
  });
};

export const getProjects = async () => {
  const sheetData: string[][] = await getSheetData(
    HumanResourceSpreadsheetId,
    ProjectsRange
  );

  const headers = sheetData[0].map(toCamelCase);

  return sheetData.slice(1).map((row) => {
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
