'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<string[][]>([]);

  useEffect(() => {
    fetch('/api/sheets', { next: { revalidate: 3600 } })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  return (
    <main>
      <h1>Google Sheets Data</h1>
      <ul>
        {data.map((row, index) => (
          <li key={index}>{row.join(', ')}</li>
        ))}
      </ul>
    </main>
  );
}
