import {useEffect, useRef, useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Checkbox, Modal, Upload, message } from 'antd';
import { AuthContext } from '../context/AuthContext';
// 이거 있어야지 에디터 쓸 수 있음!
import { Editor } from '@toast-ui/react-editor';
// 토스트 UI 에디터 임포트임!
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';

// 커스텀 툴바 만드는 거라는 데 이건 솔직히 못만들겠다 아직은 ㅠ
const LOGIN_REQUIRED_KEY = 'login_required_message';
// 로그인 후 이용가능 메세지 두번 출력하지 않기 위해 만든 변수

function Write(){
  
  const navigate = useNavigate(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const [form] = Form.useForm(); // 이 넘이 관리함!

  const {isLoginedId} = useContext(AuthContext);

  // 요게 로그인 검증 하는 거임 세션에서 받아온 값으로!!!
  useEffect (() => {
    if(!isLoginedId) {
      message.error({
        content: "글쓰기는 로그인 후 이용 가능합니다.",
        key: LOGIN_REQUIRED_KEY,
         duration: 5,
      });
      // 리액트 문제로 충돌이 난다. 그래서 키 값을 줘서 안티 디자인이 인식해서 오류 제거하는 느낌
      navigate("/login"); 
    }
  }, [isLoginedId, navigate]);
  // 매끄럽게 화면 이동 없으면 깜박인다고 함 
  if(!isLoginedId) {
    return null;
  }
  // const [title, setTitle] = useState(''); 제거함 안티 폼이 관리해서 굳이 필요 없음!!
  // const [mainContent, setMainContent] = useState('');
  // const [sideContent, setSideContent] = useState('');

  //토스트 UI 불러오려고 만든 거임
  const editorRef = useRef();
  


  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalMessage('');
    setIsModalOpen(false);
    navigate("/list");
  };
  // 모달 선언이라서 밖에 있어야 함

  const handleSubmit = async (values) => { // 벨류는 폼 안에 있는 값들 자동적으로 가져올라고
    //첨부파일 때문에 폼데이타로 넘기려고
    const formData = new FormData();


    let mainContentMarkdown = '';
    if (editorRef.current) {
        const instance = editorRef.current.getInstance();

        if (instance) {
            mainContentMarkdown = instance.getMarkdown();
        }
    }
    
    if (!mainContentMarkdown.trim()) {
        message.error("메인 작성 내용을 입력해주세요.");
        return; 
    }
      // 제이슨으로 못받아서 폼데이타에 넘겨서 각자 받는다
      formData.append ('title', values.title);
      formData.append ('mainContent', mainContentMarkdown);
      formData.append ('sideContent', values.sideContent);
      

      //여기서 안에 파일 업로드한지 검증하고 있으면 파일 보내겠다는 소리임 originFileObj 이거는 upload 타입 안에 실제로 있는 변수 명임! fileObj 이건 그냥 만든거고! 여러갤 수 있으니
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
          openModal('등록이 완료되었습니다.');
      } else {
        openModal('등록을 실패했습니다.');
      }
    } catch (error) {
      console.error("통신 오류:", error);
      openModal('통신 오류가 발생했습니다.');
    }
  };

  return (
    <div className="app-container max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex justify-between">
        <div className="text-xl font-bold p-2 border-b text-start">WorkLog Write</div>
        <Link to="/" className="pt-4">홈으로</Link>
      </div>
      {/* 요렇게 해야 폼이 알아서 관리 해줌 위에 변수도 줬으니 폼으로 받아서 알아서 백으로 넘겨주는 거임!*/}
      <Form
        form={form}
        layout="vertical"
        className="space-y-4"
        onFinish={handleSubmit}
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

        {/* 이게 토스트 유아이 가져오는 거임! */}
        <div className="mb-6">
            <label className="ant-form-item-label">
                <span className="ant-form-item-required text-lg font-semibold">MainContent</span>
            </label>
            <Editor
                ref={editorRef} // Ref 연결해서 적용 하는 거
                initialValue="내용을 입력하세요." // 안에 기본 내용 
                previewStyle="vertical"
                height="500px"
                initialEditType="wysiwyg" // 위지윅 모드 설정?? 이건 잘 모르것음
                use='default' // 기본 값 세팅
            />
        </div>
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
            valuePropName="fileList" //이거 그냥 쉽게 이름 주는거임 안에 있는 파일들 리스트라는 거
            getValueFromEvent={(e) => e.fileList} // 음 업로드 자체 내용 안에 파일리스트가 있어서 이벤트가 발생하면 파일리스트를 가져온다
          > 
            {/* 비포어는 업로드 전에 호출되는 함수로 아무것도 안올라와있으면 제출을 방지하는 함수임  멀티플은 여러개 선택한다는 것 */}
            {/* 음 정확하게 이것때문에 파일리스트에만 저장 됬다가 버튼을 등록하기 버튼을 누르면 위에 올라가서 전송되는 것임! */}
            <Upload beforeUpload={() => false} multiple> 
              <Button className="py-1">파일 선택</Button>
            </Upload>
          </Form.Item>
        </div>


        <Form.Item className="mt-8">
          <Button
            type="primary" // 요게 버튼 스타일
            htmlType="submit" // 자바에서 했던 것처럼 누르면 서브밋으로 제출
            className="w-full bg-blue-500 hover:bg-blue-600" // 디자인 
          >
            등록하기
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