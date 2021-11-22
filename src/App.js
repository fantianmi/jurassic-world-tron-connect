import { React, useState, useEffect } from 'react';
import './App.css';
import logo from './logo.svg';
import { Modal} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Login from './Login'
import EggsBuy from "./EggsBuy"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Router>

        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route exact path="/buyEggs" element={<EggsBuy/>}/>
          {/* <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/recovery-password" element={<RecoveryPassword/>}/>
          <Route path="*" element={<NotFound/>}/> */}
        </Routes>

    </Router>
  );
}

export default App;
