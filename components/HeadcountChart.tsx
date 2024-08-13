import { Project, WeeklyReport } from '@/lib/types';
import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const options = {
  title: 'Headcount Comparison by Project',
  hAxis: {
    title: 'Projects',
  },
  vAxis: {
    title: 'Number of Headcount',
  },
  seriesType: 'bars',
  colors: ['#fbc02d', '#e64a19'],
};
type HeadcountChartProps = {
  reports: WeeklyReport[];
  projects: Project[];
};

const HeadcountChart = ({
  reports = [],
  projects = [],
}: HeadcountChartProps) => {
  const chartData = useMemo(() => {
    return [
      ['Project', 'Billable', 'Allocated + Shadow'],

      ...projects.map((item) => {
        const numberOfEmployees = reports.filter(
          (report) => report.project === item.project
        ).length;

        const totalBillable = Object.values(item.billable).reduce(
          (acc, cur) => acc + cur,
          0
        );

        return [item.project, totalBillable, numberOfEmployees];
      }),
    ];
  }, [projects, reports]);

  return (
    <Chart
      chartType='ColumnChart'
      width='100%'
      height='800px'
      data={chartData}
      options={options}
    />
  );
};

export default HeadcountChart;
