import { getEmployees, getReports } from '@/lib/googleSheets';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  if (!params.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  try {
    const reports = await getReports(params.date);
    const employees = await getEmployees();

    const reportsWithEmployees = reports.map((report) => {
      const employee = employees.find(
        (employee) => employee.employeeId === report.employeeId
      );

      if (report.shadowFor) {
        const shadowFor = employees.find(
          (employee) => employee.employeeName === report.shadowFor
        );

        if (shadowFor) {
          return { ...report, employee, shadowFor };
        }
      }

      return { ...report, employee };
    });

    return NextResponse.json(reportsWithEmployees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
