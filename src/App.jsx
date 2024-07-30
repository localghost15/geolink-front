import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { Notfoundpage } from './pages/Notfoundpage';
import { Layout } from './components/Layout'
import Roles from './pages/Roles';
import Patients from './pages/Patients/Patients.';
import Doctors from './pages/Doctors/Doctors';
import Services from './pages/Services';
import Partners from './pages/Partners';
import EpidemiologicalHistory from './pages/EpidemiologicalHistory/EpidemiologicalHistory';
import Mkb10 from './pages/Mkb10/Mkb10';
import Payments from './pages/Payments/Payments';
import DeptsLists from './pages/DeptsLists/DeptsLists';
import Admissions from './pages/Admissions/Admissions';
import PatientDetails from './pages/PatientDetails';
import 'suneditor/dist/css/suneditor.min.css';
import NewAdmissions from './pages/NewAdmissions/NewAdmissions';
import ReAdmissions from './pages/ReAdmissions/ReAdmissions';
import ListOfDisponser from './pages/ListOfDisponser/ListOfDisponser';
import Login from './auth/Login';
import { isLoggedIn, getUserRole } from './services/authServices';
import Users from "./pages/Users/Users";
import PatientAdmission from "./pages/PatientAdmission";
import PatientBioCard from './pages/PatientBioCard';
import PatientsReport from "./pages/Reports/PatientsReport";
import DoctorsReport from "./pages/Reports/DoctorsReport";
import FundsReport from "./pages/Reports/FundsReport";
import DoctorsReportDetail from "./pages/Reports/DoctorsReportDetail";
import FundsReportDetail from "./pages/Reports/FundsReportDetail";
import Apartaments from "./pages/Apartaments";
import StationaryTable from "./pages/StationaryList";

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  return children;
}

function AdminRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const userRole = await getUserRole();
      if (!userRole || !userRole.includes("admin")) {
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  return children;
}

function PublicRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  return children;
}

function App() {
  
  return (
    <Routes>
    <Route path="/login" name="login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
      <Route index element={<Homepage />} />
      {isLoggedIn() && (
        <Route path="roles" element={<AdminRoute><Roles /></AdminRoute>} />
      )}
      <Route path="patients" element={<Patients />} />
      <Route path="stationary" element={<StationaryTable />} />
      <Route path="/patient-old/:index" element={<PatientDetails />} />
      <Route path="/patient/:index" element={<PatientBioCard />} />
      <Route path="/patient/admission/:index" element={<PatientAdmission />} />
      <Route path="/catalog/doctors" element={<Doctors />} />
      {/*<Route path="users" element={<Users />} />*/}
      <Route path="/catalog/services" element={<Services />} />
      <Route path="/apartaments" element={<Apartaments />} />
      <Route path="/catalog/partners" element={<Partners />} />
      <Route path="/catalog/epidemiological_history" element={<EpidemiologicalHistory />} />
      <Route path="/catalog/international-classification-of-diseases" element={<Mkb10 />} />
      <Route path="/payments/history" element={<Payments />} />
      <Route path="/payments/debtors" element={<DeptsLists />} />
      <Route path="/appointments/queue" element={<Admissions />} />
      <Route path="/appointments/reappointments" element={<NewAdmissions />} />
      <Route path="/appointments/followups" element={<ReAdmissions />} />
      <Route path="/appointments/dispensary" element={<ListOfDisponser />} />
      <Route path="/reports/patients" element={<PatientsReport />} />
      <Route path="/reports/patients" element={<PatientsReport />} />
      <Route path="/reports/doctors" element={<DoctorsReport />} />
      <Route path="/reports/finance" element={<FundsReport />} />
      <Route path="/reports/doctors/:doctorId" element={<DoctorsReportDetail />} />
      <Route path="/reports/finance/:date" element={<FundsReportDetail />} />
      <Route path="*" element={<Notfoundpage />} />
    </Route>
  </Routes>

  );
}

export default App;
