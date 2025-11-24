import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import DaumPostcodeEmbed from 'react-daum-postcode';


// 디자인은 차후 수정 예정
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
  {/* 최상위 컨테이너: 중앙 정렬 및 그림자 적용 */}
  <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-2xl mt-10">
    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-3">
      회원가입 페이지 📝
    </h2>
    
    <table className="min-w-full divide-y divide-gray-200">
      <tbody className="bg-white divide-y divide-gray-100">
        
        {/* 아이디 */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 w-1/4">아이디</td>
          <td className="px-4 py-3">
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </td>
        </tr>
        
        {/* 비밀번호 */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">비밀번호</td>
          <td className="px-4 py-3">
            <input
              // 🚨 보안: type="password"로 변경하는 것을 권장합니다.
              type="password" 
              placeholder="비밀번호를 입력하세요"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </td>
        </tr>
        
        {/* 비밀번호 확인 */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">비밀번호 확인</td>
          <td className="px-4 py-3">
            <input
              // 🚨 보안: type="password"로 변경하는 것을 권장합니다.
              type="password" 
              placeholder="비밀번호를 다시 입력하세요"
              // value, onChange는 컴포넌트 로직에 맞게 추가해야 함
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </td>
        </tr>
        
        {/* 이름 */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">이름</td>
          <td className="px-4 py-3">
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </td>
        </tr>
        
        {/* Email */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">Email</td>
          <td className="px-4 py-3">
            <input
              type="text"
              placeholder="Email을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </td>
        </tr>
        
        {/* 성별 */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">성별</td>
          <td className="px-4 py-3">
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            >
              <option value="C">성별 선택</option>
              <option value="M">남성</option>
              <option value="W">여성</option>
            </select>
          </td>
        </tr>
        
        {/* 주소 */}
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">주소</td>
          <td className="px-4 py-3 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => setIsPostcodeOpen(true)}
              className="w-1/2 p-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition duration-150 shadow-md"
            >
              우편번호 찾기
            </button>
            {/* 주소 input은 우편번호 버튼 옆이 아닌 아래로 배치하여 가독성 개선 */}
            <input
              type="text"
              placeholder="주소를 입력하세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              // readOnly 클래스를 추가하여 우편번호 검색으로만 입력 가능하도록 유도하는 것도 좋음
              className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </td>
        </tr>

      </tbody>
    </table>
    
    {/* 등록하기 버튼 (테이블 밖, 중앙 정렬) */}
    <div className="mt-8 text-center">
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full sm:w-1/2 p-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-lg transform hover:scale-105"
      >
        등록하기
      </button>
    </div>

  </div>
  
  {/* 우편번호 모달 (기존 구조 유지) */}
  {isPostcodeOpen && (
    <div style={modalStyle} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-2xl relative">
        <button 
            onClick={() => setIsPostcodeOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold"
        >
            &times; 닫기
        </button>
        <DaumPostcodeEmbed
          onComplete={handleComplete}
          autoClose={false}
        />
      </div>
    </div>  
  )}
</div>
    )
}


export default Join;