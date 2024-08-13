export type Employee = {
  employeeId: string;
  employeeName: string;
  lineManager: string;
  coreSkills: string[];
  domains: string;
  level: string;
};

export type WeeklyReport = {
  project: string;
  startOfWeek: string;
  employeeId: string;
  employee: Employee;
  effort: number;
};
