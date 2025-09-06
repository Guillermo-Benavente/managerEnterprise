import { Route } from 'react-router-dom';
import Companies from "Pages/Companies/Companies";
import CompanyEdit from "Pages/Companies/CompanyEdit";
import CompanyDocument from 'Pages/Companies/CompanyDocument';
import CompanyCreateDocument from 'Pages/Companies/CompanyCreateDocument';
import CompanyEditDocument from 'Pages/Companies/CompanyEditDocument';

export default function CompanyRoutes() {
  return (
    <>
      <Route path="/company">
        <Route index element={<Companies />} />
        <Route path=":id" element={<CompanyEdit />} />
        <Route path=":id/new" element={<CompanyCreateDocument />} />
        <Route path=":id/:documentId" element={<CompanyDocument />} />
        <Route path=":id/:documentId/edit" element={<CompanyEditDocument />} />
      </Route>
    </>
  );
}