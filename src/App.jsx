import { Routes, Route} from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { Notfoundpage } from './pages/Notfoundpage';
import { Layout } from './components/Layout'
import Roles from './pages/Roles';
import Patients from './pages/Patients/Patients.';
import Doctors from './pages/Doctors/Doctors';
import Services from './pages/Services';
import Partners from './pages/Partners';
import EpidemiologicalHistory from './pages/EpidemiologicalHistory/EpidemiologicalHistory';
import Mkb10 from './pages/Mkb10';
import Payments from './pages/Payments/Payments';
import DeptsLists from './pages/DeptsLists/DeptsLists';
import Admissions from './pages/Admissions/Admissions';
import PatientDetails from './pages/PatientDetails';
import 'suneditor/dist/css/suneditor.min.css';
import NewAdmissions from './pages/NewAdmissions/NewAdmissions';
import ReAdmissions from './pages/ReAdmissions/ReAdmissions';
import ListOfDisponser from './pages/ListOfDisponser/ListOfDisponser';
import Login from './auth/Login';

function App() {
  return (
      <Routes>
        <Route path="login" index element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="roles" element={<Roles />} />
          <Route path="patients"  element={<Patients/>} />
          <Route path="/patient/:index" element={<PatientDetails />} />
          <Route path="doctors"  element={<Doctors/>} />
          <Route path="services" element={<Services/>} />
          <Route path="partners" element={<Partners/>} />
          <Route path="epidemiological_history"  element={<EpidemiologicalHistory/>} />
          <Route path="international-classification-of-diseases"  element={<Mkb10/>} />
          <Route path="payments"  element={<Payments/>} />
          <Route path="depts_lists"  element={<DeptsLists/>} />
          <Route path="admissions"  element={<Admissions/>} />
          <Route path="new_admissions"  element={<NewAdmissions/>} />
          <Route path="re_admissions"  element={<ReAdmissions/>} />
          <Route path="list_of_disponser"  element={<ListOfDisponser/>} />
          <Route path="*" element={<Notfoundpage />} />
        </Route>
      </Routes>

  );
}

export default App;
