// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';  // 마찬가지로 여기도 해줘야 함

import Home from './pages/Home';
import List from './pages/List';
import Detail from './pages/Detail';
import Write from './pages/Write';
import Join from './pages/Join';
import Modify from './pages/Modify';
import Login from './pages/Login';
import Logout from './pages/Logout';
import MyPage from './pages/MyPage';
import HandoverWrite from './pages/HandoverWrite';

// ✅ 새로 만들 레이아웃
import MainLayout from './layouts/MainLayout';

function App(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ✅ 랜딩 페이지 (지금처럼 배경 큰 이미지 있는 메인) */}
          <Route path="/" element={<Home />} />

          {/* ✅ 로그인 / 회원가입 등은 공통 레이아웃 없이 단독 페이지 */}
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />

          {/* ✅ 여기부터는 “헤더 + 왼쪽 메뉴 + 가운데 내용만 변경” 되는 구간 */}
          <Route element={<MainLayout />}>
            <Route path="/list" element={<List />} />
            <Route path="/write" element={<Write />} />
            <Route path="/handoverWrite" element={<HandoverWrite />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/modify/:id" element={<Modify />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/logout" element={<Logout />} />
            {/* 나중에 /daily, /weekly 이런 것도 여기 안에 추가하면 됨 */}
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
