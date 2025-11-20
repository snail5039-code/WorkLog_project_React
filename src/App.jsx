import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import List from './pages/List';
import Detail from './pages/Detail';
import Write from './pages/Write';
import Join from './pages/Join';

function App(){
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/list">목록</Link>
        <Link to="/write">글쓰기</Link>
        <Link to="/join">회원가입</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/write" element={<Write />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/join/" element={<Join />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;