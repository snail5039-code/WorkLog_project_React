import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // 페이지 이동을 위한 Link import
import { Button, Input } from 'antd';
import LogoutButton from './Logout'; //여기서 버튼 가져 올때 이름 바꾼 것!
import { AuthContext } from '../context/AuthContext';

// 디자인은 차후 수정 예정
function Home() {

  const {isLoginedId} = useContext(AuthContext)
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div className="">
          <div className="p-6">로고</div>
        </div>
        <div className="container mx-auto p-5 flex justify-around navbar bg-base-100 shadow-lg">
          <Link to="/" className="btn btn-ghost text-xl">홈으로</Link>
          <div>WorkLog란?</div>
          <div>이용 방법</div>
          <Link to="/write" className="btn btn-ghost text-xl">직접 사용하기</Link>
          <div>부가적인 기능들</div>
          <div>고객센터</div>
        </div>
        <div>

          {/* <Link to="/mypage">마이페이지</Link> */}
          {isLoginedId !== 0 ? (
            <LogoutButton />
           ) : (
             <Link
                to="/login"
               className="pr-6 btn bg-white text-black border-[#e5e5e5]"
              >
               로그인/회원가입
              </Link>
           )}
        </div>
      </div>
      <div>
        사진 <img className="w-full" src="https://picsum.photos/500/300.jpg" /> // 임시 이미지
      </div>
      <div>
        <div className="relative w-full max-w-5xl mx-auto h-[450px] pt-10 pb-20">
          사진 <img className="w-[80%] h-[80%] object-cover absolute top-0 left-0 z-10 shadow-xl rounded-xl" src="https://picsum.photos/500/500.jpg" /> // 임시 이미지
          사진 <img className="transform rotate-3 w-[60%] h-[60%] object-cover absolute bottom-0 right-0 z-20 shadow-2xl rounded-xl border-8 border-white" src="https://picsum.photos/500/300.jpg" /> // 임시 이미지
        </div>
        <div className="relative w-full max-w-5xl mx-auto h-[450px] pt-10 pb-20">
        </div>
      </div>

      <div className="text-center mb-10">시작하러가기</div>
    </div>
  );
}
export default Home;