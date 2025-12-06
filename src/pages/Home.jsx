// src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './Logout';
import { AuthContext } from '../context/AuthContext';
import MainHeader from '../components/MainHeader';

function Home() {
  const { isLoginedId } = useContext(AuthContext); 
  const isLoggedIn = isLoginedId !== 0;

  return (
    // 전체 배경: 밝은 회색 (bg-gray-50), 기본 텍스트: 어두운 회색 (text-gray-800)
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <MainHeader />   {/* ✅ 공통 헤더 사용 */}

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
            to="/login" // ✅ 시작하기 → 로그인 페이지로 이동
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
