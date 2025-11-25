import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  isLoginedId: false,
  setIsLoginedId: () => {}, 
});

export function AuthProvider({ children }) {

  const [isLoginedId, setIsLoginedId] = useState(false); 
  //어찌됬든 이거는 로그인 버튼 있고 없애고 하려고 만든 것임!


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
// 같은 라인에 있는 파일들은 넘어가기 복잡하므로 이거를 만들어서 임포트 시켜서 쉽게 넘겨준다.