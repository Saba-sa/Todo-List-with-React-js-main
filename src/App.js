import React from 'react';
import Action from './components/Action.jsx';
import { Context } from './hooks/Context.js';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import DragAndDropExample from "./components/Handledraganddrop.jsx";

const App = () => {
  return (
    <div>
      <Context>
        <BrowserRouter>
          <DragAndDropExample />
          {/* <Routes>
            <Route path='/' element={<Signup />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />}></Route>
            <Route path='/action' element={<Action />}></Route>
            <Route path='/action/:id' element={<Action />}></Route>
            <Route path='/home' element={<Dashboard />}></Route>
          </Routes> */}
        </BrowserRouter>
      </Context>
    </div>
  )
}

export default App


