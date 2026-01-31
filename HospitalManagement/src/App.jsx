import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Choice from './pages/Choice';
import Adminlog from './pages/Adminlog';
import Stafflog from './pages/Stafflog';
import Doctorlog from './pages/Doctorlog';

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;