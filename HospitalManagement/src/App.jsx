import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Choice from './pages/Choice';
import Adminlog from './pages/Adminlog';
import Stafflog from './pages/Stafflog';
import Doctorlog from './pages/Doctorlog';
import Register from './pages/Register';

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;