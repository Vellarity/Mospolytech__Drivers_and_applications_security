import { Route, Routes } from 'react-router-dom';
import './App.css';
import { FaceLogPage } from './pages/FaceLogPage';

import { LoginPage } from './pages/LoginPage.js';
import { MainPage } from './pages/MainPage.js'

function App() { 

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/mainList" element={<MainPage/>} />
      <Route path="faceLog" element={<FaceLogPage />} />
    </Routes>
  );
}

export default App;
