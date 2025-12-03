// // 로컬스토리지에서 로그인 여부 가져오기
// const [isLoginedId, setIsLoginedId] = useState(() => {
//   return localStorage.getItem('isLogined') === 'true'; // true/false로 변환
// });

// // 로그인 상태가 바뀔 때마다 로컬스토리지에 저장
// useEffect(() => {
//   if (isLoginedId) {
//     localStorage.setItem('isLogined', 'true');
//   } else {
//     localStorage.removeItem('isLogined');
//   }
// }, [isLoginedId]);
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Firebase


import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isLoginedId: 0,
  setIsLoginedId: () => {},
});
// 요렇게 세팅해야 계속 값을 저장한다.
export function AuthProvider({ children }) {

  const [isLoginedId, setIsLoginedId] = useState(0);
  // 로딩 상태: 인증 정보 확인이 완료될 때까지 앱 UI 렌더링을 막기 위해 추가
    const [isLoading, setIsLoading] = useState(true);

  // ⭐️ 백엔드와 Firebase 사용자 정보를 동기화하는 함수 추가 ⭐️
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) {
        setIsLoginedId(0); // 로그아웃 상태
        return;
    }
    try {
      // 백엔드에 Firebase UID를 전달하여 DB에 사용자 등록/로그인 처리 요청
      const response = await fetch('http://localhost:8081/api/usr/member/social-login', {
          method: 'post',
          headers: { 'content-type': 'application/json' },
          // Firebase의 고유 UID와 이메일을 백엔드에 전달
          body: JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email }), 
          credentials: 'include'
      });
      // 내일 다시 추가 할거임
  // 기존 로그인 주석 처리, 위에껄로 통합해서 쓸거임!    
  // useEffect(() => {
  //   const veiwSession = async () => {
  //     try {
  //       const res = await fetch('http://localhost:8081/api/usr/member/session', {
  //         method: 'get',
  //         credentials: 'include',
  //       });
  //       if (res.ok) {
  //         const data = await res.json();
  //         console.log(data);
  //         setIsLoginedId(data);
  //       }
  //     } catch (err) {
  //       console.error('세션 조회 실패:', err);
  //     }
  //   };

  //   veiwSession();
  // }, []);
        
  const contextValue = {
    isLoginedId,
    setIsLoginedId,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
