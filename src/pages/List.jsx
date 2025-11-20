import React from 'react';
import { Link } from 'react-router-dom'; 

function List() {
  return (
    <div>
      <Link to="/">홈으로</Link>
      <h2>게시글 목록</h2>
        <ul>
          <li><Link to="/detail">1번 게시글 예시</Link></li>
          <li><Link to="/detail">2번 게시글 예시</Link></li>
        </ul>
    </div>
  );
}

export default List;