import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Button, Input, Form, Checkbox, Modal, Upload, message } from 'antd';
import { AuthContext } from '../context/AuthContext';

const LOGIN_REQUIRED_KEY = 'login_required_message';
// 디자인은 차후 수정 예정
function List() {

  const navigate = useNavigate(); 
  const {isLoginedId} = useContext(AuthContext);

  useEffect (() => {
    if(isLoginedId == 0) {
      message.error({
        content: "목록 보기는 로그인 후 이용 가능합니다.",
        key: LOGIN_REQUIRED_KEY,
         duration: 5,
      });
      // 리액트 문제로 충돌이 난다. 그래서 키 값을 줘서 안티 디자인이 인식해서 오류 제거하는 느낌
      navigate("/login"); 
    }
  }, [isLoginedId, navigate]);
  // 매끄럽게 화면 이동 없으면 깜박인다고 함 
  if(isLoginedId == 0) {
    return null;
  }


  const [articles, setArticles] = useState([]);

  useEffect(() => {
    
    const API_URL = 'http://localhost:8081/api/usr/work/list';

    fetch(API_URL)
      .then(Response => {
        if(!Response.ok) {
          throw new Error(`HTTP error! status: ${Response.status}`);
        }
        return Response.json();
      })
      .then(fetchedData => {
        setArticles(fetchedData || []);

      })
      .catch(error => {
        console.error("데이터 불러오기 실패:", error);
        setArticles([]);
      })
  }, []);

  return (
   <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <div className="mb-4">
      </div>
      
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">게시글 목록</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-1/12">번호</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-6/12">제목</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/12">작성자</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-3/12">작성일</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{article.id}</td>
                  <td className="px-4 py-3 whitespace-normal text-sm font-medium">
                    <Link to={`/detail/${article.id}`} className="text-gray-800 hover:text-indigo-600 transition duration-150">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{article.writerName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{article.regDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500 text-base font-medium">
                  등록된 게시글이 없습니다.
                </td>
              </tr>  
            )}          
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default List;