import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isLoginedId: false,
  setIsLoginedId: () => {},
});
// 요렇게 세팅해야 계속 값을 저장한다.
export function AuthProvider({ children }) {

  // 로컬스토리지에서 로그인 여부 가져오기
  const [isLoginedId, setIsLoginedId] = useState(() => {
    return localStorage.getItem('isLogined') === 'true'; // true/false로 변환
  });

  // 로그인 상태가 바뀔 때마다 로컬스토리지에 저장
  useEffect(() => {
    if (isLoginedId) {
      localStorage.setItem('isLogined', 'true');
    } else {
      localStorage.removeItem('isLogined');
    }
  }, [isLoginedId]);

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
