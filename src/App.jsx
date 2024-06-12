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
      <Route path="/patient-old/:index" element={<PatientDetails />} />
      <Route path="/patient/:index" element={<PatientBioCard />} />
      <Route path="/patient/admission/:index" element={<PatientAdmission />} />
      <Route path="doctors" element={<Doctors />} />
      {/*<Route path="users" element={<Users />} />*/}
      <Route path="services" element={<Services />} />
      <Route path="partners" element={<Partners />} />
      <Route path="epidemiological_history" element={<EpidemiologicalHistory />} />
      <Route path="international-classification-of-diseases" element={<Mkb10 />} />
      <Route path="payments" element={<Payments />} />
      <Route path="depts_lists" element={<DeptsLists />} />
      <Route path="admissions" element={<Admissions />} />
      <Route path="new_admissions" element={<NewAdmissions />} />
      <Route path="re_admissions" element={<ReAdmissions />} />
      <Route path="list_of_disponser" element={<ListOfDisponser />} />
      <Route path="*" element={<Notfoundpage />} />
    </Route>
  </Routes>

  );
}

export default App;
