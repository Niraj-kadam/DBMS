import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Choice from './pages/Choice';
import Adminlog from './pages/Adminlog';
import Stafflog from './pages/Stafflog';
import Doctorlog from './pages/Doctorlog';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import DoctorPage from './pages/DoctorPage';
import StaffPage from './pages/StaffPage';
import About from './pages/About';

function App(){
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/choice' element={<Choice/>}/>
          <Route path='/adminlog' element={<Adminlog/>}/>
          <Route path='/stafflog' element={<Stafflog/>}/>
          <Route path='/doctorlog' element={<Doctorlog/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/adminpage' element={<AdminPage/>}/>
          <Route path='/doctorpage' element={<DoctorPage/>}/>
          <Route path='/staffpage' element={<StaffPage/>}/>
          <Route path='/about' element={<About/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;