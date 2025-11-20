import React from 'react';
import { Link } from 'react-router-dom'; 

function Join() {
  const [loginId, setLoginId] = React.useState('');
  const [loginPw, setLoginPw] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [sex, setSex] = React.useState('');
  const [address, setAddress] = React.useState('');

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
        method: 'post',
        headers: {'content-tyoe': 'applaication/json'},
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

  return (
  <div>
    <h2>회원가입 페이지</h2>  
    <table>
      <tr>
        <td>아이디</td>
        <td><input type="text" placeholder='아이디를 입력하세요'/></td>
      </tr>
      <tr>
        <td>비밀번호</td>
        <td><input type="text" placeholder='아이디를 입력하세요'/></td>
      </tr>
      <tr>
        <td>비밀번호 확인</td>
        <td><input type="text" placeholder='아이디를 입력하세요'/></td>
      </tr>
      <tr>
        <td>이름</td>
        <td><input type="text" placeholder='아이디를 입력하세요'/></td>
      </tr>
      <tr>
        <td>email</td>
        <td><input type="text" placeholder='아이디를 입력하세요'/></td>
      </tr>
      <tr>
        <td>성별</td>
        <td><input type="text" placeholder='아이디를 입력하세요'/></td>
      </tr>
      <tr>
        <td>주소</td>
        <td><input type="text" placeholder='아이디를 입력하세요'/></td>
      </tr>
    </table>
  </div>
  );
}
export default Join;