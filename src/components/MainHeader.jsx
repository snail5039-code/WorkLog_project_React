// src/components/MainHeader.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../pages/Logout';
import { AuthContext } from '../context/AuthContext';
import { div } from 'framer-motion/client';

function MainHeader() {
  const { isLoginedId } = useContext(AuthContext); 
  const isLoggedIn = isLoginedId !== 0;

  return (
    // 전체 배경: 밝은 회색 (bg-gray-50), 기본 텍스트: 어두운 회색 (text-gray-800)
    // 1차 메뉴 (Header) - 밝은 배경
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200 shadow-md bg-white sticky top-0 z-50">
      
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/" className="text-3xl font-extrabold text-teal-600">
          WorkLog
        </Link>
      </div>

      {/* Navigation Bar (1차 메뉴) - 호버 시 연한 회색 배경/흰색 글자 적용 */}
      <nav className="flex justify-center space-x-2">
        
        {/* 1차 메뉴 항목들: 호버 클래스 통일 (hover:bg-gray-600 hover:text-white) */}
        <Link to="/" className="text-lg px-3 py-2 rounded-md transition-colors duration-200 hover:bg-gray-600 hover:text-white">
          홈으로
        </Link>
        <div className="text-lg px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 hover:text-white">
          WorkLog란?
        </div>
        <div className="text-lg px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 hover:text-white">
          이용 방법
        </div>
        <Link to="/write" className="text-lg px-3 py-2 rounded-md transition-colors duration-200 hover:bg-gray-600 hover:text-white">
          직접 사용하기
        </Link>
        <Link to="/detail/123" className="text-lg px-3 py-2 rounded-md transition-colors duration-200 hover:bg-gray-600 hover:text-white">
          부가적인 기능들
        </Link>
        <div className="text-lg px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 hover:text-white">
          고객센터
        </div>
      </nav>

      {/* Auth Buttons - 로그인 버튼의 호버 스타일 통일 */}
      <div>
        {isLoggedIn ? (
            <div className="flex items-center gap-3">
                <Link to="/mypage" className="mr-2 text-gray-700 hover:text-teal-600">MyPage</Link>  
                <LogoutButton /> 
            </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2 bg-teal-600 text-white rounded-md font-medium transition-colors duration-200 shadow-lg hover:bg-gray-600"
          >
            로그인/회원가입
          </Link>
        )}
      </div>
    </header>
  );
}

export default MainHeader;
