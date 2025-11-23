import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import DaumPostcodeEmbed from 'react-daum-postcode';

function Join() {
  const [loginId, setLoginId] = React.useState('');
  const [loginPw, setLoginPw] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [sex, setSex] = React.useState('C');
  const [address, setAddress] = React.useState('');

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setAddress(fullAddress);

    setIsPostcodeOpen(false);
    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };
  

  const handleSubmit = async () => {

    const userData = {
      loginId : loginId,
      loginPw : loginPw,
      name : name,
      email : email,
      sex : sex,
      address : address,
    };
    console.log(userData);

    try {
      const response = await fetch('/api/usr/member/join',{
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(userData)
      }
    );
      if(response.ok){
        const result = await response.text();
        alert('회원가입이 완료되었습니다. 서버 응답:' + result);

      } else {
        alert('회원가입 실패! 서버 상태 코드 :' + response.status)
      }
    } catch (error) {
      console.error('통신오류', error);
        alert('서버와 통신할 수 없습니다.');
    }
  };
    const modalStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        height: '500px',
        border: '1px solid #ccc',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px'
    };
  return (
  <div>
    <h2>회원가입 페이지</h2>  
    <table>
      <tr>
        <td>아이디</td>
        <td><input type="text" placeholder='아이디를 입력하세요' value={loginId} onChange={(e) => setLoginId(e.target.value)}/></td>
      </tr>
      <tr>
        <td>비밀번호</td>
        <td><input type="text" placeholder='비밀번호를 입력하세요' value={loginPw} onChange={(e) => setLoginPw(e.target.value)}/></td>
      </tr>
      <tr>
        <td>비밀번호 확인</td>
        <td><input type="text" placeholder='비밀번호를 입력하세요'/></td>
      </tr>
      <tr>
        <td>이름</td>
        <td><input type="text" placeholder='이름를 입력하세요'value={name} onChange={(e) => setName(e.target.value)}/></td>
      </tr>
      <tr>
        <td>email</td>
        <td><input type="text" placeholder='Email을 입력하세요'value={email} onChange={(e) => setEmail(e.target.value)}/></td>
      </tr>
      <tr>
        <td>성별</td>
        <td>
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="C">성별 선택</option>
            <option value="M">남성</option>
            <option value="W">여성</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>주소</td>
        <td><button type="button" onClick={() => setIsPostcodeOpen(true)}>우편번호 찾기</button></td>
        <td><input type="text" placeholder='주소를 입력하세요' value={address} onChange={(e) => setAddress(e.target.value)}/></td>
      </tr>
      <tr>
        <td>
          <button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">등록하기</button>
        </td>
      </tr>
          
    </table>
    {isPostcodeOpen && (
      <div style={modalStyle}>
        <button onClick={() => setIsPostcodeOpen(false)}>닫기</button>
        <DaumPostcodeEmbed
          onComplete={handleComplete}
          autoClose={false}
        />
      </div>  
    )}
  </div>
    )
}


export default Join;