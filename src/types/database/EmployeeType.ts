type EmployeeType = {
  dni: string;
  name: string;
  surnames: string;
  discharge_date: string|Date;
  leave_date?: string|Date;
  medical_leave_date?: string|Date;
  medical_discharge_date?: string|Date;
  courses: number;
};

export default EmployeeType;