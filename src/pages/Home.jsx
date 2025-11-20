import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 이동을 위한 Link import

function Home() {
  return (
    <div>
      <div>메인화면</div>
      <div>
        <Link to="/list">게시글 목록 가기</Link>
      </div>
    </div>
  );
}
export default Home;