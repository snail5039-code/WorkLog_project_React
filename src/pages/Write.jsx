import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

function Write(){
  const [title, setTitle] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [sideContent, setSideContent] = useState('');

  const handleSubmit = async () => {

    const postData = {
      title : title,
      mainContent : mainContent,
      sideContent : sideContent,
    };
    console.log("제목", postData.title);
    console.log("메인작성내용", postData.mainContent);
    console.log("비고작성내용", postData.sideContent);

    try {
      const response = await fetch('http://localhost:8081/api/usr/work/workLog',{
        method: 'post',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(postData)
      } 
    );
      if(response.ok){
        const result = await response.text();
        alert('등록이 완료되었습니다. 서버 응답: ' + result);
        setTitle('');
        setMainContent('');
        setSideContent('');
      } else {
        alert('등록 실패! 서버 상태 코드: ' + response.status);
      }
    } catch (error) {
      console.error("통신 오류:", error);
        alert('서버와 통신할 수 없습니다.');
    }
  };

  return (
    <div className="app-container max-w-2xl mx-auto p-6 space-y-4">
      
      <div className="text-xl font-bold p-2 border-b text-start">업무일지작성</div>
      <div>
        <div>제목</div>
        <input type="text" placeholder="제목 작성란" value={title} onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <div className="flex justify-start space-x-4 border-b pb-4">
        <div className="p-4"><input type="date" /> </div>
        <div className="p-4">글꼴 선택창</div>
        <div className="p-4"><input type="file" className="border border-blue-500 rounded" /></div>
      </div>
      <div className="flex items-start space-x-4">
        <div className="w-20 pt-2 font-semibold">메인 작성란</div>
        <input className="border border-blue-500 rounded p-2 flex-grow" type="text" placeholder="여기에 작성하세요" value={mainContent} onChange={(e) => setMainContent(e.target.value)}/> 
      </div>
      
      <div className="flex items-start space-x-4">
        <div className="w-20 pt-2 font-semibold">비고</div>
        <input className="border border-blue-500 rounded p-2 flex-grow" type="text" placeholder="여기에 작성하세요" value={sideContent} onChange={(e) => setSideContent(e.target.value)}/> 
      </div>
      
      <div className="flex justify-end pt-4">
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          등록하기
        </button>
      </div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

export default Write;