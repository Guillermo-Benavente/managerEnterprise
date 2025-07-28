type EmployeeData = {
  dni: string;
  name: string;
  first_surname: string;
  second_surname?: string;
  discharge_date: string;
  leave_date?: string;
  medical_leave_date?: string;
  medical_discharge_date?: string;
  dni_date?: string;
  courses: number;
};

export default EmployeeData;