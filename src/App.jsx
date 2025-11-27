import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthContext, AuthProvider } from './context/AuthContext';  // 마찬가지로 여기도 해줘야 함
// 요거 두 개는 토스트 UI 임포트, 게시글 작성하려고 가져온 것!
import '@toast-ui/editor/dist/toastui-editor.css'; 
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

import Home from './pages/Home';
import List from './pages/List';
import Detail from './pages/Detail';
import Write from './pages/Write';
import Join from './pages/Join';
import Modify from './pages/Modify';
import Login from './pages/Login';
import Logout from './pages/Logout';
import MyPage from './pages/MyPage';


function App(){
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/write" element={<Write />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/join/" element={<Join />} />
          <Route path="/mypage/" element={<MyPage />} />
          <Route path="/modify/:id" element={<Modify />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/logout/" element={<Logout />} />
        </Routes>
      </BrowserRouter>
  );
}
export default App;