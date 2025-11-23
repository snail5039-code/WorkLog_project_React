import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

function List() {

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
    <div>
      <Link to="/">홈으로</Link>
      <h2>게시글 목록</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.id}</td>
                  <td><Link to={`/detail/${article.id}`}> {article.title}</Link></td>
                  <td>{article.writerName}</td>
                  <td>{article.regDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>등록된 게시글이 없습니다.</td>
              </tr>  
            )}          
        </tbody>
      </table>
    </div>
  );
}

export default List;