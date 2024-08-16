'use client';

import DashboardTable from '@/components/DashboardTable';
import { Employee } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch('/api/employees', { next: { revalidate: 3600 } })
      .then((response) => response.json())
      .then(setEmployees);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <DashboardTable data={employees} />
    </div>
  );
}
