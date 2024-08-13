'use client';
import HeadcountChart from '@/components/HeadcountChart';
import { Project, WeeklyReport } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';

const dateOptions = ['2024-08-05', '2024-08-12', '2024-08-19']; // TODO: get from sheet

export default function HeadcountPage() {
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);

  useEffect(() => {
    fetch('/api/projects', {
      next: { revalidate: 3600 },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      let baseUrl = `/api/reports/${selectedDate}`;

      fetch(baseUrl, {
        next: { revalidate: 3600 },
      })
        .then((response) => response.json())
        .then((data) => {
          setReports(data);
        });
    }
  }, [selectedDate]);

  const accountOptions = useMemo(() => {
    return [
      { label: 'All Accounts', value: '' },
      ...projects
        .map((item) => item.account)
        .filter((account, index, self) => self.indexOf(account) === index)
        .map((account) => ({
          label: account,
          value: account,
        })),
    ];
  }, [projects]);

  const projectOptions = useMemo(() => {
    return [
      { label: 'All Projects', value: '' },
      ...projects
        .filter((item) =>
          selectedAccount ? item.account === selectedAccount : true
        )
        .map((item) => ({
          label: item.project,
          value: item.project,
        })),
    ];
  }, [projects, selectedAccount]);

  const filteredReports = useMemo(() => {
    if (selectedProject) {
      return reports.filter((item) => item.project.includes(selectedProject));
    } else if (selectedAccount) {
      const validProjects = projects.filter(
        (item) => item.account === selectedAccount
      );

      return reports.filter((item) =>
        validProjects.some((project) => project.project === item.project)
      );
    }

    return reports;
  }, [projects, reports, selectedAccount, selectedProject]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((item) =>
        selectedAccount ? item.account === selectedAccount : true
      )
      .filter((item) =>
        selectedProject ? item.project.includes(selectedProject) : true
      );
  }, [projects, selectedAccount, selectedProject]);

  return (
    <div className='p-4 flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Head Count</h1>
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

        <label htmlFor='account'>Account:</label>
        <select
          value={selectedAccount}
          id='account'
          onChange={(e) => {
            setSelectedAccount(e.target.value);
            setSelectedProject('');
          }}
        >
          {accountOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <label htmlFor='project'>Project:</label>
        <select
          value={selectedProject}
          id='project'
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projectOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <HeadcountChart reports={filteredReports} projects={filteredProjects} />

      <h1 className='text-xl font-bold'>Raw Data</h1>
      <pre className='h-[300px] overflow-auto p-4 text-sm bg-slate-100'>
        {JSON.stringify(filteredReports, null, 2)}
      </pre>
    </div>
  );
}
