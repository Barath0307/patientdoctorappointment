import './App.css';
import Doctor from './pages/doctors/Doctor';
import Header from './pages/header/Header';
import NoMatch from './pages/nomatch/NoMatch';
import Patient from './pages/patient/Patient';
import { Route, Routes } from 'react-router-dom';
import PostPatient from './pages/patient/PostPatient';
import UpdatePatient from './pages/patient/UpdatePatient';
import PostDoctor from './pages/doctors/PostDoctor';
import UpdateDoctor from './pages/doctors/UpdateDoctor';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import { AuthProvider } from './context/AuthContext';
import AppointmentPage from './pages/appointment/appointment';

function App() {
  return (
    <>
      <AuthProvider>
        <Header />
        <Routes>
          {/* <Route path='/' element={<Dashboard/>} /> */}
          <Route path='/appointments' element={<AppointmentPage /> } />
          <Route path='/register' element={<Register /> } />
          <Route path='/login' element={<Login /> } />
          <Route path='/patients' element={<Patient/>} />
          <Route path='/postpatient' element={<PostPatient/>} />
          <Route path='/updatepatient/:id' element={<UpdatePatient/>} />
          <Route path='/doctors' element={<Doctor/>} />
          <Route path='/postdoctor' element={<PostDoctor/>} />
          <Route path='/updatedoctor/:id' element={<UpdateDoctor/>} />
          <Route path='*' element={<NoMatch/>} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
