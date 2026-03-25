import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAppContext } from './context/AppDataContext';
import Departures from './pages/Departures';
import InspectionForm from './pages/InspectionForm';
import PriceListManager from './pages/PriceListManager';
import IrregularCheckouts from './pages/IrregularCheckouts';
import ResidentDatabase from './pages/ResidentDatabase';
import ExtraCleaningCharges from './pages/ExtraCleaningCharges';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/UserManagement';

function DashboardRedirect() {
  const { role } = useAppContext();
  if (role === 'Facility') return <Navigate to="/departures" replace />;
  if (role === 'Admin') return <Navigate to="/residents" replace />;
  return <Navigate to="/users" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<DashboardRedirect />} />
            
            {/* Facility EXCLUSIVE routes */}
            <Route element={<ProtectedRoute allowedRoles={['Facility']} />}>
              <Route path="departures" element={<Departures />} />
              <Route path="extra-cleaning" element={<ExtraCleaningCharges />} />
              <Route path="inspection/:departureId" element={<InspectionForm />} />
            </Route>
            
            {/* Admin EXCLUSIVE routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="irregular-checkouts" element={<IrregularCheckouts />} />
              <Route path="residents" element={<ResidentDatabase />} />
              <Route path="pricelist" element={<PriceListManager />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Superuser EXCLUSIVE routes */}
            <Route element={<ProtectedRoute allowedRoles={['Superuser']} />}>
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
