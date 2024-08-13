'use client';

import { Employee } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch('/api/sheets/employees', { next: { revalidate: 3600 } })
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      });
  }, []);

  return (
    <div>
      <h1>Employees</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.employeeId}>
            {employee.employeeId} - {employee.employeeName} - {employee.level}
          </li>
        ))}
      </ul>
    </div>
  );
}
