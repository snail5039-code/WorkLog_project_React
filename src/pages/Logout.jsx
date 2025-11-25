import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Checkbox, Modal, message } from 'antd';
import { AuthContext } from '../context/AuthContext';

function Logout() {
  const navigate = useNavigate();

  const { setIsLoginedId } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalMessage('');
    setIsModalOpen(false);
  };


    const handleLogout = async () => {
        try {
          const response = await fetch('http://localhost:8081/api/usr/member/logout',{
            method: 'post',
            headers: {'content-type': 'application/json'},
            credentials: 'include',
          });
          
          if(response.ok) {
            openModal("로그아웃 되었습니다.");
            setTimeout(() => {
              setIsLoginedId(false); // 거짓을 담는다.
              navigate('/');
            }, 1500);
          } else {
            openModal("로그아웃 실패!");
          }
        } catch (error) {
          console.error('오류 발생');
        }
      };
      return (
        <>
          <Button
            className="pr-6 bg-white text-black border-[#e5e5e5]" 
            onClick={handleLogout}
          >
            로그아웃
          </Button>
          
          <Modal
            title={<span className="text-xl font-bold text-gray-900">알림</span>}
            open={isModalOpen}
            onCancel={closeModal}

            footer={[
              <Button
                key="confirm"
                type="primary"
                onClick={closeModal}
                className="bg-indigo-600 hover:!bg-indigo-700 focus:ring-indigo-500"
              >
                확인
              </Button>
            ]}
            className="!rounded-lg !shadow-2xl"
          >
            <p className="text-gray-700 mb-6">{modalMessage}</p>
          </Modal>
        </>
      );
    }
    export default Logout;