export type Employee = {
  employeeId: string;
  employeeName: string;
  lineManager: string;
  coreSkills: string[];
  domains: string[];
  level: string;
  shadowFor?: Employee;
};

export type WeeklyReport = {
  project: string;
  startOfWeek: string;
  employeeId: string;
  employee: Employee;
  shadowFor?: Employee;
  effort: number;
};

export type Project = {
  account: string;
  project: string;
  billable: Record<string, number>;
  manager?: string;
  employees: Employee[];
};
