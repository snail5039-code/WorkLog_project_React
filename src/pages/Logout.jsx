import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

function Logout() {
  const Navigate = useNavigate();

    const Logout = async () => {
        try {
          const response = await fetch('http://localhost:8081/api/usr/member/logout',{
            method: 'post',
            headers: {'content-type': 'application/json'},
            credentials: 'include',
          });
          
          if(response.ok) {
            const sueccess = await response.text();

            alert('로그아웃 성공' + sueccess); // 잠깐 서버에서 진짜로 로그아웃 했는지 확인하려고 만든거임
            Navigate('/');
          } else {
            alert('로그아웃 실패');
          }
        } catch (error) {
          console.error('오류 발생');
        }
      };
      return (
        <button onClick={Logout}>로그아웃</button>
      );
    }
    export default Logout;