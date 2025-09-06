import { Route } from 'react-router-dom';
import Employees from "Pages/Employees/Employees";
import EmployeeEdit from "Pages/Employees/EmployeeEdit";
import EmployeeDocument from "Pages/Employees/EmployeeDocument";

export default function EmployeeRoutes() {
  return (
    <>
      <Route path="/employee">
        <Route index element={<Employees />} />
        <Route path=":id" element={<EmployeeEdit />} />
        <Route path=":id/:documentId" element={<EmployeeDocument />} />
      </Route>
    </>
  );
}