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

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isLoginedId: 0,
  setIsLoginedId: () => {},
});
// 요렇게 세팅해야 계속 값을 저장한다.
export function AuthProvider({ children }) {

  const [isLoginedId, setIsLoginedId] = useState(0);

  useEffect(() => {
    const veiwSession = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/usr/member/session', {
          method: 'get',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setIsLoginedId(data);
        }
      } catch (err) {
        console.error('세션 조회 실패:', err);
      }
    };

    veiwSession();
  }, []);
        


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
