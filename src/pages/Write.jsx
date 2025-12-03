import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Modal, Upload, message, Spin } from 'antd';
import { AuthContext } from '../context/AuthContext'; 
// AuthContext가 존재한다고 가정하고 Context를 사용합니다.

const LOGIN_REQUIRED_KEY = 'login_required_message';
// 로그인 후 이용가능 메세지 두번 출력하지 않기 위해 만든 변수 

function Write(){
  
  const navigate = useNavigate(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const [form] = Form.useForm(); // 이 넘이 관리함!

  const [isSubmitLoading, setIsSubmitLoading] = useState(false); // 얘가 요약할때 로딩 창임

  // Context에서 로그인 ID를 가져옵니다.
  // AuthContext가 존재하지 않을 경우를 대비하여 기본값을 설정합니다. (다만 이 환경에서는 존재한다고 가정합니다)
  const {isLoginedId} = useContext(AuthContext); 

  // 메인 콘텐츠 TextArea에 접근하기 위한 Ref
  const mainContentRef = useRef(null); 

  // 요게 로그인 검증 하는 거임 세션에서 받아온 값으로!!!
  useEffect (() => {
    // isLoginedId가 0일 때만 로그인 검증 로직을 수행합니다.
    // 타입 비교를 위해 === 대신 ==을 사용하던 부분을 ===으로 수정합니다.
    if(isLoginedId === 0) { 
      message.error({
        content: "글쓰기는 로그인 후 이용 가능합니다.",
        key: LOGIN_REQUIRED_KEY,
          duration: 5,
      });
      navigate("/login"); 
    }
  }, [isLoginedId, navigate]);

  if(isLoginedId === 0) { // 타입 비교를 위해 == 대신 ===으로 수정합니다.
    return null;
  }
  
  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalMessage('');
    setIsModalOpen(false);
    navigate("/list");
  };

  const handleSubmit = async (values) => { 
    setIsSubmitLoading(true); 

    // 첨부파일을 포함하기 위해 FormData 사용
    const formData = new FormData();

    const mainContentMarkdown = values.mainContent;
    
    if (!mainContentMarkdown || !mainContentMarkdown.trim()) {
        message.error("메인 작성 내용을 입력해주세요.");
        setIsSubmitLoading(false); 
        return; 
    }
      
      formData.append ('title', values.title);
      formData.append ('mainContent', mainContentMarkdown);
      formData.append ('sideContent', values.sideContent);
      
      if(values.files && values.files.length > 0) {
        values.files.forEach((fileObj) => {
          formData.append("files", fileObj.originFileObj)
        });
      }

    try {
      const response = await fetch('http://localhost:8081/api/usr/work/workLog',{
        method: 'post',
        body: formData,
        credentials: "include" 
      } 
    );
      if(response.ok){
          openModal('등록이 완료되었습니다. (AI 요약 포함!)');
      } else {
        // 서버 응답 상태는 OK가 아니지만, 응답을 받은 경우 (4xx, 5xx)
        openModal(`등록을 실패했습니다. (HTTP Code: ${response.status})`);
      }
    } catch (error) {
      console.error("통신 오류:", error);
      // fetch 자체가 실패한 경우 (네트워크 오류, CORS 문제 등)
      openModal('통신 오류가 발생했습니다. 백엔드 서버 상태를 확인해주세요.');
    } finally {
        setIsSubmitLoading (false); 
    }
  };

  return (
    <div className="app-container max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex justify-between">
        <div className="text-xl font-bold p-2 border-b text-start">WorkLog Write</div>
        <Link to="/" className="pt-4">홈으로</Link>
      </div>
      <Form
        form={form}
        layout="vertical"
        className="space-y-4"
        onFinish={handleSubmit}
        disabled={isSubmitLoading} 
      >

        <Form.Item
          label={<span className="text-lg font-semibold text-gray-700">Title</span>}
          name="title"
          rules={[{ required: true, message: '제목을 입력해주세요'}]}
          className="mb-0"
        >
          <Input
            placeholder={'제목을 입력하세요.'}
            className="w-full"  
          />
        </Form.Item>

        {/* MainContent 입력 영역: 레이블을 Form.Item 밖으로 분리 */}
        <div className="text-lg font-semibold text-gray-700 mb-2">MainContent</div>
        <Form.Item
          name="mainContent"
          rules={[{ required: true, message: '메인 작성 내용을 입력해주세요.'}]}
          // 배경색, 테두리, 그림자 추가하여 Toast UI와 유사한 시각적 효과 부여
          className="bg-gray-50 border border-gray-200 rounded-lg shadow-md transition duration-200"
        >
          <Input.TextArea
            ref={mainContentRef} // ref 연결
            rows={15} // 충분히 큰 높이
            placeholder="오늘의 작업 내용, 발생한 이슈 및 해결 과정 등을 입력하세요."
            // Input.TextArea 자체의 테두리와 포커스 스타일을 제거하고 배경을 투명하게 설정하여 컨테이너 스타일과 통합
            className="border-none focus:ring-0 focus:border-0 bg-transparent text-base p-2"
          />
        </Form.Item>

        <div className="flex gap-4 items-center">
          <Form.Item
            label={<span className="text-lg font-semibold text-gray-700">비고</span>}
            name="sideContent"
            rules={[{ required: true, message: '내용을 입력해주세요'}]}
            className="flex-1"
          >
            <Input
              placeholder={'내용을 입력하세요.'}
              className="w-full"  
            />
          </Form.Item>

          <Form.Item
            label={<span className="pl-5 text-sm font-semibold text-gray-700">첨부파일</span>}
            name="files"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList} 
          > 
              <Upload beforeUpload={() => false} multiple maxCount={5}> 
              <Button className="py-1">파일 선택</Button>
            </Upload>
          </Form.Item>
        </div>


        <Form.Item className="mt-8">
          <Button
            type="primary" 
            htmlType="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600" 
            disabled={isSubmitLoading} 
          >
            {isSubmitLoading ? (
                <div className="flex items-center justify-center">
                    <Spin size="small" className="mr-2" /> 
                    AI 요약 처리 중...
                </div>
            ) : (
                '등록하기'
            )}
          </Button>
        </Form.Item>
      </Form> 

      <Modal
        title="알림"
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button 
            key="confirm"
            type="primary"
            onClick={closeModal}
            >
              확인
          </Button>
        ]}
      >
        <p>{modalMessage}</p>
      </Modal>

    </div>
  );
}

export default Write;