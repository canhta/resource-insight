import { skillGroups } from '@/configs/skills';
import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const options = {
  treemap: {
    minColor: '#f00',
    midColor: '#ddd',
    maxColor: '#0d0',
    fontColor: 'black',
    showScale: true,
  },
};

type SkillChartProps = {
  data: Record<string, number>;
  project?: string;
};

const SkillChart = ({ data, project }: SkillChartProps) => {
  const label = useMemo(() => project || 'Global', [project]);

  const chartData = useMemo(() => {
    const groupedData: Record<string, number> = {};
    // Group data by skill category
    Object.entries(data).forEach(([skill, count]) => {
      const group = skillGroups[skill] || 'Other';
      groupedData[group] = (groupedData[group] || 0) + count;
    });

    return [
      ['Skill', 'Parent', 'Count'],
      [label, null, 0],
      ...Object.entries(groupedData).map(([group, count]) => [
        group,
        label,
        count,
      ]),
      ...Object.entries(data).map(([skill, count]) => [
        skill,
        skillGroups[skill] || 'Other',
        count,
      ]),
    ];
  }, [data, label]);

  return (
    <Chart
      chartType='TreeMap'
      width='100%'
      height='500px'
      data={chartData}
      options={options}
    />
  );
};

export default SkillChart;
