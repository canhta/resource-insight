'use client';

import SkillChart from '@/components/SkillChart';
import { skillGroups } from '@/configs/skills';
import { WeeklyReport } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';

const dateOptions = ['2024-08-05', '2024-08-12', '2024-08-19'];
const projectOptions = [
  { label: 'All Projects', value: '' },
  { label: 'Tophat - LM', value: 'LM' },
  { label: 'Aeris - CVC', value: 'CVC' },
  { label: 'Aeris - Automotive', value: 'Automotive' },
];

export default function SkillPage() {
  const [records, setRecords] = useState<WeeklyReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0]);
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    if (selectedDate) {
      let baseUrl = `/api/sheets/reports/${selectedDate}`;
      if (selectedProject) {
        baseUrl += `?project=${selectedProject}`;
      }

      fetch(baseUrl, {
        next: { revalidate: 3600 },
      })
        .then((response) => response.json())
        .then((data) => {
          setRecords(data);
        });
    }
  }, [selectedDate, selectedProject]);

  const coreSkillCount = useMemo(() => {
    const coreSkillCount: { [key: string]: number } = {};

    records.forEach((item) => {
      item.employee.coreSkills.forEach((skill) => {
        coreSkillCount[skill] = (coreSkillCount[skill] || 0) + 1;
      });
    });

    return coreSkillCount;
  }, [records]);
  return (
    <div className='p-4 flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Resource allocation</h1>
      <div className='flex gap-4 items-center p-4 bg-slate-100'>
        <label htmlFor='date'>Date:</label>
        <select
          value={selectedDate}
          id='date'
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {dateOptions.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        <label htmlFor='project'>Project:</label>
        <select
          value={selectedProject}
          id='project'
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projectOptions.map((project) => (
            <option key={project.value} value={project.value}>
              {project.label}
            </option>
          ))}
        </select>
      </div>
      <SkillChart data={coreSkillCount} project={selectedProject} />
      <h1 className='text-xl font-bold'>Skill Configs</h1>
      <pre className='h-[300px] overflow-auto p-4 text-sm bg-slate-100'>
        {JSON.stringify(skillGroups, null, 2)}
      </pre>
    </div>
  );
}
