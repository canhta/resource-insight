import { getEmployees, getReports } from '@/lib/googleSheets';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  const queries = new URL(req.url).searchParams;
  const project = queries.get('project') || undefined;

  if (!params.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  try {
    const reports = await getReports(params.date, project);
    const employees = await getEmployees();

    const reportsWithEmployees = reports.map((report) => {
      const employee = employees.find(
        (employee) => employee.employeeId === report.employeeId
      );
      return {
        ...report,
        employee,
      };
    });

    return NextResponse.json(reportsWithEmployees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
