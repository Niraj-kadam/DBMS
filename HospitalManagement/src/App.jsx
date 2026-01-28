import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Choice from './pages/Choice';

function App(){
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/choice' element={<Choice/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;