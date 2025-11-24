import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import List from './pages/List';
import Detail from './pages/Detail';
import Write from './pages/Write';
import Join from './pages/Join';
import Modify from './pages/Modify';
import Login from './pages/Login';
import Logout from './pages/Logout';

function App(){
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/list">목록</Link>
        <Link to="/write">글쓰기</Link>
        <Link to="/join">회원가입</Link>
        <Link to="/login">로그인</Link>
        <Link to="/logout">로그아웃</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/write" element={<Write />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/join/" element={<Join />} />
        <Route path="/modify/:id" element={<Modify />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/logout/" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;