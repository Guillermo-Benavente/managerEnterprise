import { Routes, Route } from 'react-router-dom';
import Home from 'Pages/Home/Home';
import EmployeeRoutes from 'Routes/EmployeeRoutes';
import CompanyRoutes from 'Routes/CompanyRoutes';
import ProfileRoutes from 'Routes/ProfileRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {EmployeeRoutes()}
      {CompanyRoutes()}
      {ProfileRoutes()}
    </Routes>
  );
}

/** TODO: añadir rutas de otros componentes
 * 
      {ModalRoutes()}
 */