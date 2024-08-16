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
    <div>
      <h1>Employees</h1>
      <DashboardTable data={employees} />
    </div>
  );
}
