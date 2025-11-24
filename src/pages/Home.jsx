import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 이동을 위한 Link import


// 디자인은 차후 수정 예정
function Home() {
  return (
  // 💡 최상위 컨테이너: 화면 중앙에 배치, 패딩, 그림자 추가
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      
      {/* 메인 화면 제목 */}
      <div className="text-5xl font-extrabold text-indigo-700 mb-6 tracking-wide">
        메인 화면 🏠
      </div>
      
      {/* 게시글 목록 링크 */}
      <div className="mt-8">
        <Link 
          to="/list"
          // 💡 링크 버튼 스타일: 파란색 배경, 흰색 텍스트, 패딩, 둥근 모서리, 호버 효과
          className="px-6 py-3 bg-indigo-500 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-indigo-600 transition duration-300 transform hover:scale-105"
        >
          게시글 목록 가기 &rarr;
        </Link>
      </div>
    </div>
  );
}
export default Home;