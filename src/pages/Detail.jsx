import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Input, Form, Checkbox, Modal, Upload, message, Divider, List } from 'antd';
import { AuthContext } from '../context/AuthContext';

const LOGIN_REQUIRED_KEY = 'login_required_message';

// 디자인은 차후 수정 예정
function Detail() {
  const navigate = useNavigate(); 

  const {isLoginedId} = useContext(AuthContext);

  const {id} = useParams();
  const [workLog, setWorkLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileAttaches, setFileAttaches] = useState([]); // 파일들임


  useEffect (() => {
    if(isLoginedId == 0) {
      message.error({
        content: "상세보기는 로그인 후 이용 가능합니다.",
        key: LOGIN_REQUIRED_KEY,
         duration: 5,
      });
      // 리액트 문제로 충돌이 난다. 그래서 키 값을 줘서 안티 디자인이 인식해서 오류 제거하는 느낌
      navigate("/login"); 
    }
  }, [isLoginedId, navigate]);
  // 매끄럽게 화면 이동 없으면 깜박인다고 함 
  if(isLoginedId == 0) {
    return 0;
  }



  useEffect(() => {
    
    const API_URL = `http://localhost:8081/api/usr/work/detail/${id}`;

    fetch(API_URL)
      .then(Response => {
        if(!Response.ok) {
          throw new Error(`HTTP error! status: ${Response.status}`);
        }
        return Response.json();
      })
      .then(fetchedData => {
        setWorkLog(fetchedData);
        setLoading(false); 

      })
      .catch(error => {
        console.error("데이터 불러오기 실패:", error);
        setLoading(false); 
      })
  }, [id]);

// 렌더링 오류 방지 코드임
  if (loading) {
    return <div>게시글 로딩 중</div>
  }
  if (!workLog || Object.keys(workLog).length == 0) {
    return <div>게시글이 없습니다.</div>
  }

  const getDownloadUrl = (storedFilename) => {
    return `http://localhost:8081/api/usr/work/download/${storedFilename}`; // 백엔드에서 만들어야됌...
  };
  return (
    <div>
      <div>
        <Link to="/">홈으로</Link>
        <Link to="/list">목록으로</Link>
      </div>
      <h2>
        제목 : {workLog.title}
      </h2>
      <div>
        작성자 : {workLog.memberName} ({workLog.writerName})
      </div>
      <div>
        작성일 : {workLog.regDate}
      </div>
      <Divider>주요 업무 내용</Divider>
      <div>
        {workLog.mainContent}
      </div>
      <Divider orientation="left">첨부 파일</Divider>
        <div>
            {/* 별 생각하지 말고 그냥 외우거나 가져오자 특별하게 중요한거는 없다. */}
          <List
              size="small"
              bordered
              dataSource={fileAttaches}
              locale={{ emptyText: <p>첨부된 파일이 없습니다.</p> }}
              renderItem={file => (  
                // {/*파일을 가져 오는거임*/}
                  <List.Item
                      actions={[
                        <a 
                        // 위에 함수 있음 
                            href={getDownloadUrl(file.storedFilename)} 
                            target="_blank"
                            rel="noopener noreferrer"
                            download={file.originalFilename}
                            key={`download-${file.id}`}
                        >
                          <Button 
                              type="link" 
                              icon={<DownloadOutlined />} 
                          >
                              다운로드
                          </Button>
                        </a>
                      ]}
                  >
                    {/* 파일 다운할때 안쪽 그 스타일임 */}
                    <List.Item.Meta 
                        avatar={<FileTextOutlined style={{ fontSize: '16px' }} />}
                        title={
                          <span>
                            {file.originalFilename} 
                            <Text type="secondary" style={{ marginLeft: '10px' }}>  {/*주위보다 연한 색으로*/}
                              ({Math.round(file.fileSize / 1024)} KB)
                            </Text>
                          </span>
                          }
                      />
                  </List.Item>
                )}
            />
        </div>
        <div>
          <Divider orientation="left">비고</Divider>
          <div>{workLog.sideContent}</div>  
        </div>      
          {workLog.summaryContent && (
          <>
            <Divider orientation="left">요약 내용</Divider>
            <Card 
              title= "분석 결과"
              bordered={true}
            >
                    </Card>
            <div>
              {workLog.summaryContent}
            </div>
           </>
          )}
        <div>
          <Link to={`/Modify/${id}`}>
            <Button type="primary">수정하기</Button>
          </Link>
        </div>
    </div>
  );
}
export default Detail;