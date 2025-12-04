import React, { createContext, useState, useEffect } from 'react';

// AuthContext 정의
export const AuthContext = createContext({
    isLoginedId: 0,
    setIsLoginedId: () => {},
    isLoading: true, // 로딩 상태를 Context에 포함
});
// 요렇게 세팅해야 계속 값을 저장한다.
export function AuthProvider({ children }) {
    // 1. 상태 정의
    const [isLoginedId, setIsLoginedId] = useState(0);
    // 로딩 상태: 인증 정보 확인이 완료될 때까지 앱 UI 렌더링을 막기 위해 추가
    const [isLoading, setIsLoading] = useState(true); // 초기값은 true

    // 2. useEffect: 컴포넌트 마운트 시 세션 상태 확인 및 isLoginedId 업데이트
    useEffect(() => {
        const veiwSession = async () => {
            try {
                // 세션 확인 요청 (credentials: 'include' 필수)
                const res = await fetch('http://localhost:8081/api/usr/member/session', {
                    method: 'get',
                    credentials: 'include',
                });
                
                if (res.ok) {
                    const data = await res.json();
                    // 백엔드에서 사용자 ID를 반환한다고 가정
                    console.log(data);
                    setIsLoginedId(data); 
                } else {
                    // 세션 만료 등으로 200 OK가 아니면 로그아웃 상태로 처리
                    setIsLoginedId(0);
                }
            } catch (err) {
                console.error('세션 조회 실패:', err);
                setIsLoginedId(0); // 네트워크 오류 시 로그아웃 처리
            } finally {
                // ⭐️ 이 부분이 중요합니다. 성공/실패 여부와 관계없이 로딩 상태를 해제합니다.
                setIsLoading(false); 
            }
        };

        veiwSession();
    }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때만 실행

    // 3. ⭐️ 이 부분이 화면 표시 문제를 해결합니다. ⭐️
    // 로딩 중일 때 로딩 인디케이터 렌더링 (isLoading이 true일 때만 실행)
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl text-teal-600 animate-pulse">
                    인증 정보를 확인 중입니다... 잠시만 기다려 주세요.
                </div>
            </div>
        );
    }

    // 4. Context 값 정의
    const contextValue = {
        isLoginedId,
        setIsLoginedId,
        isLoading, // ⭐️ isLoading을 Context에 포함시켜 다른 컴포넌트에서 로딩 상태를 알 수 있게 합니다.
    };

    // 요렇게 세팅해야 계속 값을 저장한다.
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}