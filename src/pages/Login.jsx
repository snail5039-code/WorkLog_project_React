import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

function Login() {
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const navigate = useNavigate(); 
  const handleSubmit = async () => {
    const loginData = {
      loginId : loginId,
      loginPw : loginPw,
    };
    console.log(loginId);
    
    try {
      const response = await fetch('http://localhost:8081/api/usr/member/login', {
        method: 'post',
        headers: {'content-type' : 'application/json' },
        body: JSON.stringify(loginData),
        credentials: 'include'
      }
    );  

      if(response.ok) {
        alert('로그인 성공', )
        navigate("/");
      } else {
        const errorMessage = await response.text();
        console.error('로그인 실패:', response.status, errorMessage);
        alert( loginId + '로그인 실패!') // 이런식으로 넣어서 한다
        // 보통 비밀번호 or 아이디가 일치하지 않습니다라고 많이 표현하니 추후 이걸로 바꾸자 
      }

    } catch (error) {
      console.error('로그인 오류');
      alert('로그인 중 통신 오류');
    }
  };
  return (
    <div>
      <div>
        <div>아이디</div>
        <span><input type="text" placeholder={'아이디를 입력하세요.'} value={loginId} onChange={(e) => setLoginId(e.target.value)}/></span>
      </div>
      <div>
        <div>비밀번호</div>
        <span><input type="text" placeholder={'비밀번호를 입력하세요.'} value={loginPw} onChange={(e) => setLoginPw(e.target.value)}/></span>
      </div>
      <button type="button" onClick={handleSubmit}>로그인</button>
    </div>
  );
}
export default Login;