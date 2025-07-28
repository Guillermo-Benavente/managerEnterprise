import { HashRouter } from 'react-router-dom';
import AppRoutes from 'Routes/AppRoutes';

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}