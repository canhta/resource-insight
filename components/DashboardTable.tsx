import React, { useState, useMemo, useCallback } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ExpandedState,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  SortingState,
  FilterFn,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Employee } from '@/lib/types';

type DashboardTableProps = {
  data: Employee[];
  getEmployeeDetails: (id: string, slug: string) => Promise<Employee>;
};

const DashboardTable = ({
  data = [],
  getEmployeeDetails,
}: DashboardTableProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [employeeDetails, setEmployeeDetails] = useState<{
    [key: string]: Employee;
  }>({});

  const columnHelper = createColumnHelper<Employee>();

  const arrayFilter: FilterFn<Employee> = (
    row,
    columnId,
    filterValue: string[]
  ) => {
    if (!filterValue.length) return true;
    const rowValue = row.getValue(columnId) as string[];
    return filterValue.some((fv) => rowValue.includes(fv));
  };

  const fetchEmployeeDetails = useCallback(
    async (id: string, slug: string) => {
      if (!employeeDetails[id]) {
        const details = await getEmployeeDetails(id, slug);
        setEmployeeDetails((prev) => ({ ...prev, [id]: details }));
      }
    },
    [getEmployeeDetails, employeeDetails]
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'expander',
        cell: ({ row }) => (
          <button
            onClick={() => {
              row.toggleExpanded();
              if (!row.getIsExpanded()) {
                fetchEmployeeDetails(row.original.employeeId, 'projects');
              }
            }}
            className='pr-4'
          >
            {row.getIsExpanded() ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        ),
      }),
      columnHelper.accessor('employeeId', {
        cell: (info) => info.getValue(),
        header: 'ID',
      }),
      columnHelper.accessor('employeeName', {
        cell: (info) => info.getValue(),
        header: 'Name',
      }),
      columnHelper.accessor('lineManager', {
        cell: (info) => info.getValue(),
        header: 'Line Manager',
      }),
      columnHelper.accessor('level', {
        cell: (info) => info.getValue(),
        header: 'Level',
      }),
      columnHelper.accessor('coreSkills', {
        cell: (info) => (
          <div className='flex flex-wrap gap-1'>
            {info.getValue().map((skill, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'
              >
                {skill}
              </span>
            ))}
          </div>
        ),
        header: 'Core Skills',
        filterFn: arrayFilter,
        sortingFn: (rowA, rowB, columnId) => {
          const skillsA = rowA.getValue(columnId) as string[];
          const skillsB = rowB.getValue(columnId) as string[];
          return skillsA.length - skillsB.length;
        },
      }),
      columnHelper.accessor('domains', {
        cell: (info) => info.getValue().join(', '),
        header: 'Domains',
        filterFn: arrayFilter,
        sortingFn: (rowA, rowB, columnId) => {
          const domainsA = rowA.getValue(columnId) as string[];
          const domainsB = rowB.getValue(columnId) as string[];
          return domainsA.length - domainsB.length;
        },
      }),
    ],
    [columnHelper, fetchEmployeeDetails]
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onExpandedChange: setExpanded,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      expanded,
      columnFilters,
      sorting,
    },
  });

  const allSkills = useMemo(
    () => Array.from(new Set(data.flatMap((employee) => employee.coreSkills))),
    [data]
  );

  const allDomains = useMemo(
    () => Array.from(new Set(data.flatMap((employee) => employee.domains))),
    [data]
  );

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {table.getAllColumns().map((column) => {
          if (!column.getCanFilter()) return null;

          const columnId = column.id;

          if (columnId === 'coreSkills' || columnId === 'domains') {
            const options = columnId === 'coreSkills' ? allSkills : allDomains;
            return (
              <div key={columnId} className='space-y-2'>
                <label className='font-medium'>
                  {column.columnDef.header as string}
                </label>
                <div className='flex flex-wrap gap-2'>
                  {options.map((option) => (
                    <label key={option} className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={(
                          (column.getFilterValue() as string[]) || []
                        ).includes(option)}
                        onChange={(e) => {
                          const filterValue =
                            (column.getFilterValue() as string[]) || [];
                          if (e.target.checked) {
                            column.setFilterValue([...filterValue, option]);
                          } else {
                            column.setFilterValue(
                              filterValue.filter((v: string) => v !== option)
                            );
                          }
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={columnId} className='space-y-2'>
              <label htmlFor={columnId} className='font-medium'>
                {column.columnDef.header as string}
              </label>
              <input
                id={columnId}
                type='text'
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                className='w-full px-3 py-2 border rounded-md'
                placeholder={`Filter ${column.columnDef.header as string}...`}
              />
            </div>
          );
        })}
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='bg-gray-100'>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {header.isPlaceholder ? null : (
                      <div className='flex items-center space-x-2'>
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className='focus:outline-none'
                          >
                            {{
                              asc: <ArrowUp size={14} />,
                              desc: <ArrowDown size={14} />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown size={14} />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr className='hover:bg-gray-50'>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className='px-6 py-4 bg-gray-50'
                    >
                      <div className='text-sm text-gray-700'>
                        {employeeDetails[row.original.employeeId] ? (
                          <div>
                            <p>
                              <strong>Employee ID:</strong>{' '}
                              {
                                employeeDetails[row.original.employeeId]
                                  .employeeId
                              }
                            </p>
                            <p>
                              <strong>Name:</strong>{' '}
                              {
                                employeeDetails[row.original.employeeId]
                                  .employeeName
                              }
                            </p>
                            <p>
                              <strong>Line Manager:</strong>{' '}
                              {
                                employeeDetails[row.original.employeeId]
                                  .lineManager
                              }
                            </p>
                            <p>
                              <strong>Level:</strong>{' '}
                              {employeeDetails[row.original.employeeId].level}
                            </p>
                            <p>
                              <strong>Core Skills:</strong>{' '}
                              {employeeDetails[
                                row.original.employeeId
                              ].coreSkills?.join(', ')}
                            </p>
                            <p>
                              <strong>Domains:</strong>{' '}
                              {employeeDetails[
                                row.original.employeeId
                              ].domains?.join(', ')}
                            </p>
                            {employeeDetails[row.original.employeeId]
                              .shadowFor && (
                              <p>
                                <strong>Shadowing:</strong>{' '}
                                {
                                  employeeDetails[row.original.employeeId]
                                    ?.shadowFor?.employeeName
                                }
                              </p>
                            )}
                            {/* Add any additional details you want to display */}
                          </div>
                        ) : (
                          <p>Loading details...</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
