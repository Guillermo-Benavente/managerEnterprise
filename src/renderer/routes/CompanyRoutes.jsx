import { Route } from 'react-router-dom';
import Companies from "Pages/Companies/Companies";
import CompanyEdit from "Pages/CompanyEdit/CompanyEdit";

export default function CompanyRoutes() {
  return (
    <>
      <Route path="/company">
        <Route index element={<Companies />} />
        <Route path=":id" element={<CompanyEdit />} />
      </Route>
    </>
  );
}