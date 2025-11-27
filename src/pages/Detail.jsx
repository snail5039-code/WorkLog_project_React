import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Checkbox, Modal, Upload, message } from 'antd';
import { AuthContext } from '../context/AuthContext';

const LOGIN_REQUIRED_KEY = 'login_required_message';
// 디자인은 차후 수정 예정
function Detail() {

  const navigate = useNavigate(); 
  const {isLoginedId} = useContext(AuthContext);

  useEffect (() => {
    if(!isLoginedId) {
      message.error({
        content: "상세보기는 로그인 후 이용 가능합니다.",
        key: LOGIN_REQUIRED_KEY,
         duration: 5,
      });
      // 리액트 문제로 충돌이 난다. 그래서 키 값을 줘서 안티 디자인이 인식해서 오류 제거하는 느낌
      navigate("/login"); 
    }
  }, [isLoginedId, navigate]);
  // 매끄럽게 화면 이동 없으면 깜박인다고 함 
  if(!isLoginedId) {
    return null;
  }

  const {id} = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const API_URL = `http://localhost:8081/api/usr/work/detail/${id}`;

    fetch(API_URL)
      .then(Response => {
        if(!Response.ok) {
          throw new Error(`HTTP error! status: ${Response.status}`);
        }
        return Response.json();
      })
      .then(fetchedData => {
        setArticle(fetchedData);
        setLoading(false); 

      })
      .catch(error => {
        console.error("데이터 불러오기 실패:", error);
        setLoading(false); 
      })
  }, [id]);

// 렌더링 오류 방지 코드임
  if (loading) {
    return <div>게시글 로딩 중</div>
  }

  if (!article || Object.keys(article).length == 0) {
    return <div>게시글이 없습니다.</div>
  }

  return (
    // 최상위 컨테이너: 중앙 정렬, 최대 너비 설정, 그림자 효과
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-xl rounded-2xl mt-10">
      
      {/* 🏠 네비게이션 링크 */}
      <div className="flex justify-between border-b pb-4 mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-700 font-medium transition duration-150">
          홈으로
        </Link>
        <Link to="/list" className="text-gray-600 hover:text-gray-800 font-medium transition duration-150">
          목록으로 돌아가기
        </Link>
      </div>

      {/* 📄 제목 */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-4 border-indigo-500 pb-2">
        {id}번 상세보기
      </h2>

      {/* ℹ️ 작성자 및 작성일 정보 */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 flex justify-between text-sm text-gray-600">
        <p>
          <span className="font-semibold text-gray-700 mr-2">작성자</span> {article.writerName} 
        </p>
        <p>
          <span className="font-semibold text-gray-700 mr-2">작성일</span> {article.regDate}
        </p>
      </div>

      {/* 🚀 주요 업무 내용 섹션 */}
      <div className="mb-8 border rounded-lg overflow-hidden">
        <h3 className="text-xl font-bold bg-indigo-500 text-white p-3">주요 업무 내용</h3>
        <div className="p-4 text-gray-700 whitespace-pre-wrap min-h-[100px]">
          {article.mainContent}
        </div>
      </div>

      {/* 📝 비고 섹션 */}
      <div className="mb-8 border rounded-lg overflow-hidden">
        <h3 className="text-xl font-bold bg-gray-100 text-gray-700 p-3 border-b">비고</h3>
        <div className="p-4 text-gray-700 whitespace-pre-wrap min-h-[80px] bg-white">
          {article.sideContent}
        </div>
      </div>

      {/* ✏️ 수정하기 버튼 */}
      <div className="mt-8 text-center">
        <Link
          to={`/modify/${id}`}
          className="inline-block p-3 bg-green-500 text-white text-lg font-bold rounded-lg hover:bg-green-600 transition duration-200 shadow-md transform hover:scale-105"
        >
          게시글 수정하기
        </Link>
      </div>
    </div>
  );
}
export default Detail;