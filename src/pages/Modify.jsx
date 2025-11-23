import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function Modify() {
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
    <div>
      <Link to="/">홈으로</Link>
      <Link to="/list">목록으로 돌아가기</Link>
      <h2>{id}상세보기</h2>
      <div>
        <p>
          <span>작성자</span> {article.writerName} 
        </p>
        <p>
          <span>작성일</span> {article.regDate}
        </p>
      </div>
      <div>
        <h2>주요 업무 내용</h2>
        <div>
          {article.mainContent}
        </div>
      </div>
      <div>
        <h2>비고</h2>
        <div>
          {article.sideContent}
        </div>
      </div>
    </div>
  );
}
export default Modify;