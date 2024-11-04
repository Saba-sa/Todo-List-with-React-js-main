import React from 'react';
import Action from './components/Action.js';
import Display from './components/Display';
import { Context } from './hooks/Context.js';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login.js';
import Signup from './components/Signup.js';

const App = () => {
  return (
    <div>
      <Context>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Signup />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />}></Route>
            <Route path='/action' element={<Action />}></Route>
            <Route path='/action/:id' element={<Action />}></Route>
            <Route path='/home' element={<Display />}></Route>
          </Routes>
        </BrowserRouter>
      </Context>
    </div>
  )
}

export default App


