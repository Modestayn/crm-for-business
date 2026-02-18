export interface Group {
  id: string;
  name: string;
  studentsCount: number;
  maxStudents: number;
  progress: number;
  status: 'Активна' | 'Набір' | 'Завершена';
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  load: string;
  groups: Group[];
}

export interface DashboardStats {
  students: { val: string; up: string };
  groups: { val: string; up: string };
  revenue: { val: string; up: string };
  attendance: { val: string; up: string };
}