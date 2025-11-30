import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from 'antd';
import LogoutButton from './Logout';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { isLoginedId } = useContext(AuthContext); 
  const isLoggedIn = isLoginedId !== 0;

  return (
    // 전체 배경: 밝은 회색 (bg-gray-50), 기본 텍스트: 어두운 회색 (text-gray-800)
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* 1차 메뉴 (Header) - 밝은 배경 */}
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
            <LogoutButton /> 
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

      {/* 2차 메뉴 바 - 로그인 시에만 표시 - 밝은 배경 */}
      {isLoggedIn && (
        <div className="w-full bg-white shadow-inner py-3 border-b border-gray-200">
          <div className="container mx-auto flex justify-start space-x-12 px-8">
            
            {/* 2차 메뉴: 업무 관련 */}
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="text-lg text-gray-800 font-medium px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 hover:text-white">
                업무 관련
              </div>
              {/* 3차 메뉴: 업무 관련 서브 메뉴 (게시글 목록 추가) */}
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52 border border-gray-300">
                <li><Link to="/write" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white">게시글 작성</Link></li>
                <li><Link to="/list" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white font-bold">게시글 목록</Link></li> {/* <--- 추가됨 */}
                <li><Link to="/daily" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white">일일업무일지</Link></li>
                <li><Link to="/weekly" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white">주간업무일지</Link></li>
                <li><Link to="/monthly" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white">월간업무일지</Link></li>
              </ul>
            </div>

            {/* 2차 메뉴: 인수인계 관련 */}
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="text-lg text-gray-800 font-medium px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 hover:text-white">
                인수인계 관련
              </div>
              {/* 3차 메뉴: 인수인계 관련 서브 메뉴 (인수인계 목록 추가) */}
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52 border border-gray-300">
                <li><Link to="/handover/write" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white">인수인계 작성</Link></li>
                <li><Link to="/handover/list" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white font-bold">인수인계 목록</Link></li> {/* <--- 추가됨 */}
              </ul>
            </div>

            {/* 2차 메뉴: 그 외 게시판 */}
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="text-lg text-gray-800 font-medium px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-600 hover:text-white">
                그 외 게시판
              </div>
              {/* 3차 메뉴: 그 외 게시판 서브 메뉴 (공지사항/자유게시판은 목록 역할이므로 변경 없음) */}
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52 border border-gray-300">
                <li><Link to="/notice" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white">공지사항</Link></li>
                <li><Link to="/freeboard" className="text-sm text-gray-800 rounded-md hover:bg-gray-600 hover:text-white">자유게시판</Link></li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Area (기존 내용 유지) */}
      <main className="container mx-auto mt-8 p-4">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-xl mb-12">
          <img
            className="w-full h-full object-cover opacity-80" 
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Work Log Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 to-transparent flex items-center justify-center"> 
            <h1 className="text-5xl font-bold text-gray-800 text-center drop-shadow-md">
              업무를 효율적으로, WorkLog와 함께
            </h1>
          </div>
        </section>

        {/* Feature Section */}
        <section className="relative w-full max-w-5xl mx-auto h-[450px] pt-10 pb-20 mb-12">
          <img
            className="w-[80%] h-[80%] object-cover absolute top-0 left-0 z-10 shadow-xl rounded-xl border-4 border-white"
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Work Log Feature 1"
          />
          <img
            className="transform rotate-3 w-[60%] h-[60%] object-cover absolute bottom-0 right-0 z-20 shadow-2xl rounded-xl border-8 border-white"
            src="https://images.unsplash.com/photo-1549642676-e820c7cc6c51?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Work Log Feature 2"
          />
        </section>

        {/* Call to Action - 버튼 호버 스타일 통일 */}
        <section className="text-center mb-10">
          <Link
            to="/write"
            className="inline-block px-12 py-4 bg-teal-600 text-white text-xl font-semibold rounded-full shadow-lg transition-colors duration-300 transform hover:scale-105 hover:bg-gray-600"
          >
            지금 시작하러 가기
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 mt-12 border-t border-gray-200 text-gray-500 bg-white">
        &copy; 2025 WorkLog. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;