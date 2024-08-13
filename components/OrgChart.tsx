import { Project, WeeklyReport } from '@/lib/types';
import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const options = {
  allowHtml: true,
};

type OrgChartProps = {
  reports: WeeklyReport[];
  projects?: Project[];
};

const OrgChart = ({ reports, projects }: OrgChartProps) => {
  const chartData = useMemo(() => {
    return generateOrgChartData(projects || [], reports || []);
  }, [projects, reports]);

  return (
    <Chart
      chartType='OrgChart'
      width='100%'
      height='800px'
      options={options}
      data={chartData}
    />
  );
};

const generateOrgChartData = (projects: Project[], reports: WeeklyReport[]) => {
  const data = [['Name', 'Manager', 'Tooltip']];

  const accountSet = new Set();
  const projectMap: Record<string, string> = {};

  // Iterate over projects to structure the hierarchy
  projects.forEach((item) => {
    const accountName = `${item.account}`;
    if (!accountSet.has(accountName)) {
      data.push([accountName, '', 'Account']);
      accountSet.add(accountName);
    }

    const billableFTE = Object.values(item.billable).reduce(
      (acc, val) => acc + val,
      0
    );

    const actualFTE = reports
      .filter((report) => report.project === item.project)
      .reduce((acc, val) => acc + Number(val.effort), 0);

    const percentage = Math.round((actualFTE / billableFTE) * 10000) / 100;

    const projectName = `
    ${item.project}
    ${percentage}% FTE
    `;

    projectMap[item.project] = projectName;
    data.push([projectName, accountName, 'Project']);
  });

  // Iterate over reports to assign roles and employees
  reports.forEach((report) => {
    const projectName = projectMap[report.project];
    const role = `
    ${report.employee.level} Dev
    ${report.effort * 100}%
    `;
    const type = report.shadowFor ? `Shadow` : 'Interface';

    const employeeName = `
    [${type}]
    ${report.employee.employeeName}
    (${report.employee.level})
    ${report.effort * 100}%
    `;

    data.push([role, projectName, 'Role']);
    data.push([employeeName, role, 'Employee']);
  });

  return data;
};

export default OrgChart;
