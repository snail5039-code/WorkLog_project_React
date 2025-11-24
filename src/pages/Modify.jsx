import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';


//  디자인 나중에 수정 예정 
// 나중에 aync-await 문법으로 변경 예정

function Modify() {
  const {id} = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  const [title, setTitle] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [sideContent, setSideContent] = useState('');

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
        setTitle(fetchedData.title);
        setMainContent(fetchedData.mainContent);
        setSideContent(fetchedData.sideContent);
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

  const handleSubmit = async () => {

    const modifyData = {
      title : title,
      mainContent : mainContent,
      sideContent : sideContent,
    }
    console.log(modifyData);
    try {
      const response = await fetch(`http://localhost:8081/api/usr/work/modify/${id}`,{
        method: 'post',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(modifyData)
      });
      if(response.ok) {
        const result = await response.text();
        alert('수정이 완료되었습니다. 서버 응답:' + result);
        navigate(`/detail/${id}`);
      } else {
        alert('수정 실패! 서버 상태 코드:' + response.status)
      }
    } catch (error) {
      console.error('통신오류', error);
        alert('서버와 통신할 수 없습니다.');
    }
  }

return (
    // 디자인 적용: 최상위 컨테이너 스타일링 (중앙 정렬, 그림자, 둥근 모서리)
		<div className="p-8 max-w-3xl mx-auto bg-white shadow-2xl rounded-xl mt-10">
			{/* 네비게이션 링크 컨테이너 */}
			<div className="flex justify-between border-b pb-4 mb-6">
				<Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition duration-150 p-2 rounded hover:bg-gray-100">
					홈으로
				</Link>
				<Link to="/list" className="text-gray-600 hover:text-gray-800 font-medium transition duration-150 p-2 rounded hover:bg-gray-100">
					목록으로 돌아가기
				</Link>
			</div>
			
			{/* 제목 스타일링 */}
			<h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-4 border-red-500 pb-2">
				{id}번 게시글 수정
			</h2>

			{/* 게시글 정보 (읽기 전용) 스타일링 */}
			<div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-8 flex flex-wrap justify-between text-sm text-gray-700">
				{/* 제목 입력 필드 */}
				<div className="w-full mb-4">
					<p className="flex items-center">
						<span className="font-semibold text-gray-800 mr-2 min-w-[50px]">제목</span> 
						<input 
							type="text" 
							value={title} 
							onChange={(e) => setTitle(e.target.value)}
							// 입력 필드 스타일링: 전체 너비, 둥근 모서리, 포커스 시 링 효과
							className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
						/> 
					</p>
				</div>
				
				{/* 나머지 정보는 2열로 배치 */}
				<p className="w-full sm:w-1/2 mb-2">
					<span className="font-semibold text-gray-800 mr-2">작성자</span> {article.writerName} 
				</p>
				<p className="w-full sm:w-1/2 mb-2">
					<span className="font-semibold text-gray-800 mr-2">작성일</span> {article.regDate}
				</p>
				<p className="w-full sm:w-1/2">
					<span className="font-semibold text-gray-800 mr-2">수정일</span> {article.updateDate}
				</p>
			</div>
			
			{/* 주요 업무 내용 섹션 */}
			<div className="mb-6">
				<h2 className="text-xl font-bold text-gray-800 mb-3 mt-6 border-b pb-1">주요 업무 내용</h2>
				<div>
					{/* Textarea처럼 보이도록 높이 지정 */}
					<input 
						type="text" 
						value={mainContent} 
						onChange={(e) => setMainContent(e.target.value)}
						className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 h-24"
					/> 
				</div>
			</div>

			{/* 비고 섹션 */}
			<div className="mb-8">
				<h2 className="text-xl font-bold text-gray-800 mb-3 mt-6 border-b pb-1">비고</h2>
				<div>
					{/* Textarea처럼 보이도록 높이 지정 */}
					<input 
						type="text" 
						value={sideContent} 
						onChange={(e) => setSideContent(e.target.value)}
						className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 h-16"
					/> 
				</div>
			</div>
			
			{/* 수정 완료 버튼 스타일링 */}
			<div className="mt-8 text-center">
				<button 
					onClick={handleSubmit}
					// 버튼 스타일링: 눈에 띄는 붉은색, 호버 애니메이션 효과
					className="inline-block p-3 px-6 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition duration-300 shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-red-300"
				>
					수정 완료
				</button>
			</div>
		</div>
  );
}
export default Modify;