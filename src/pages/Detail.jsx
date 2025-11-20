import React from 'react';
import { useParams } from 'react-router-dom';

function Detail() {
  const { id } = useParams();
  return (
    <div>
      <Link to="/">홈으로</Link>
      <h2>{id}상세보기</h2>
    </div>
  );
}
export default Detail;