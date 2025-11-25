import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Button, Input, Form, Checkbox, Modal } from 'antd';
import { AuthContext } from '../context/AuthContext';


function Login() {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate(); 

  const {setIsLoginedId} = useContext(AuthContext);
  useEffect(() => {

    const rememberdId = localStorage.getItem('rememberdId');

    if(rememberdId) {
      form.setFieldsValue({
        loginId: rememberdId,
        remember: true,
      });
    }
  }, [form]);

  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };
  const onFinish = async (values) => {

    if(values.remember) {
      localStorage.setItem('rememberdId', values.loginId);
    } else {
      localStorage.removeItem('rememberdId');
    }
    const loginData = {
      loginId : values.loginId,
      loginPw : values.loginPw,
    };

    try {
      const response = await fetch('http://localhost:8081/api/usr/member/login', {
        method: 'post',
        headers: {'content-type' : 'application/json'},
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      if(response.ok) {
        setIsLoginedId(true); // 참 값을 담는다.
        openModal(values.loginId + '님 환영합니다.');
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        const errorMessage = await response.text();
        console.error('로그인 실패:', response.status, errorMessage);
        openModal('아이디 또는 비밀번호가 일치하지 않습니다.')
      }

    } catch (error) {
      console.error('로그인 오류:', error);
      openModal('서버와 연결을 확인하세요.');
    }

  }

      
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome WorkLog</h2>

          <Form
            form={form}
            name="login_form"
            initialValues={{ remember: true}}
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">LoginId</span>}
            name="loginId"
            rules={[{ required: true, message: '아이디를 입력해주세요.'}]}
            className="mb-0"
          >
           <Input
            placeholder={'아이디를 입력하세요.'}
            className="w-full"  
          />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium text-gray-700">Password</span>}
            name="loginPw"
            rules={[{ required: true, message: '비밀번호를 입력해주세요.'}]}
            className="mb-0"
          >
           <Input.Password
            placeholder={'비밀번호를 입력하세요.'}
            className="w-full"  
          />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="mb-0"
            >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox>
                  <span className="ml-2 block text-sm text-gray-500 dark:text-gray-400">
                    계정 기억하기
                  </span>
                </Checkbox>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-500 hover:text-indigo-600">아이디, 비밀번호 찾기</a>
              </div>
            </div>
          </Form.Item>

          <Form.Item className="mt-6 mb-0">

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="shadow-md hover:bg-blue-700 focus:ring-offset-2 transition duration-150"
            >
              로그인
            </Button>
          </Form.Item>
        </Form>

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

          <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-[#1E2028] text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
          </div>
          <button onClick={() => handleSocialLogin('github')} className="w-full btn bg-black text-white border-black">
            <svg aria-label="GitHub logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path></svg>
            Login with GitHub
          </button>
          <button onClick={() => handleSocialLogin('google')} className="w-full btn bg-white text-black border-[#e5e5e5]">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Login with Google
          </button>

        <div className="text-center text-sm text-gray-600">
            <Link to="/join" className="text-black hover:text-blue-800">
                회원가입
            </Link>
        </div>
      </div>
    </div>
  );
}
export default Login;