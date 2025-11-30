import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, message, Divider, List, Card, Layout, Typography, Space, Row, Col } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext'; 


const { Content } = Layout;
const { Title, Text } = Typography;

const LOGIN_REQUIRED_KEY = 'login_required_message';

// === 디자인 변수 (Minimal, Professional, Dark) ===
const DARK_BG = '#141414'; // 전체 배경
const CARD_BG = '#1f1f1f'; // 카드 및 컨테이너 배경
const BORDER_COLOR = '#303030'; // 구분선 및 테두리 색상
const PRIMARY_TEXT = '#f0f0f0'; // 기본 텍스트 색상
const SECONDARY_TEXT = '#a0a0a0'; // 보조 텍스트 색상
const ACCENT_COLOR = '#4a90e2'; // 버튼 및 링크 강조 색상

// 디자인은 차후 수정 예정
function Detail() {
  const navigate = useNavigate();

  const { isLoginedId } = useContext(AuthContext);

  const { id } = useParams();
  const [workLog, setWorkLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileAttaches, setFileAttaches] = useState([]); // 파일들임

  useEffect(() => {
    if (isLoginedId === 0) {
      message.error({
        content: "상세보기는 로그인 후 이용 가능합니다.",
        key: LOGIN_REQUIRED_KEY,
        duration: 5,
      });
      navigate("/login");
    }
  }, [isLoginedId, navigate]);
  
  if (isLoginedId === 0) {
    return null;
  }

  useEffect(() => {
    const API_URL = `http://localhost:8081/api/usr/work/detail/${id}`;

    fetch(API_URL)
      .then(Response => {
        if (!Response.ok) {
          throw new Error(`HTTP error! status: ${Response.status}`);
        }
        return Response.json();
      })
      .then(fetchedData => {
        setWorkLog(fetchedData);
        // 파일 넘겨주려고 받는 거임! 백엔드 참고!
        setFileAttaches(fetchedData.fileAttaches || [])
        setLoading(false);

      })
      .catch(error => {
        console.error("데이터 불러오기 실패:", error);
        setLoading(false);
      })
  }, [id]);

  // 렌더링 오류 방지 코드임
  if (loading) {
    return <div style={{ color: PRIMARY_TEXT, backgroundColor: DARK_BG, minHeight: '100vh', padding: '24px' }}>게시글 로딩 중</div>
  }
  if (!workLog || Object.keys(workLog).length === 0) {
    return <div style={{ color: PRIMARY_TEXT, backgroundColor: DARK_BG, minHeight: '100vh', padding: '24px' }}>게시글이 없습니다.</div>
  }

  const getDownloadUrl = (storedFilename) => {
    return `http://localhost:8081/api/usr/work/download/${storedFilename}`; // 백엔드에서 만들어야됌... 만들어버렸음!
  };

  return (
    // 전체 레이아웃 (어두운 배경 적용)
    <Layout style={{ minHeight: '100vh', backgroundColor: DARK_BG, color: PRIMARY_TEXT }}>

      {/* 1. 상단 배너/헤더 (Header/Banner) */}
      <div style={{ padding: '16px 24px', backgroundColor: CARD_BG, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0, color: PRIMARY_TEXT, fontWeight: 600 }}>
              WorkLog Detail
            </Title>
          </Col>
          <Col>

            <Space size="large"> 
              <Link to="/">
                <Button type="link" style={{ color: SECONDARY_TEXT, fontSize: '25px', padding: '8px 12px'}}>Home</Button>
              </Link>
              <Link to="/list">
                <Button type="link" style={{ color: SECONDARY_TEXT, fontSize: '25px', padding: '8px 12px' }}>List</Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 2. 메인 콘텐츠 영역 */}
      <Content style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <Card
          style={{ backgroundColor: CARD_BG, borderColor: BORDER_COLOR, color: PRIMARY_TEXT }}
          // bodyStyle Deprecation FIX: bodyStyle -> styles.body
          styles={{ body: { padding: '30px' } }}
          // bordered Deprecation FIX: bordered -> variant="outlined"
          variant="outlined" 
        >
          {/* 제목 영역 */}
          <Title level={2} style={{ color: PRIMARY_TEXT, marginTop: 0, borderBottom: `1px solid ${BORDER_COLOR}`, paddingBottom: '15px', marginBottom: '20px', fontWeight: 500 }}>
            <span style={{ color: SECONDARY_TEXT, fontSize: '0.8em', marginRight: '10px' }}>제목 :</span> {workLog.title}
          </Title>

          {/* 메타 정보 (작성자, 작성일) */}
          <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
            <Col xs={24} sm={12}>
              <Text style={{ color: SECONDARY_TEXT, fontSize: '15px'}}>작성자:</Text>
              <Text style={{ color: PRIMARY_TEXT, marginLeft: '8px', fontWeight: 400 }}>{workLog.memberName} ({workLog.writerName})</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text style={{ color: SECONDARY_TEXT, fontSize: '15px' }}>작성일:</Text>
              <Text style={{ color: PRIMARY_TEXT, marginLeft: '8px', fontWeight: 400 }}>{workLog.regDate}</Text>
            </Col>
          </Row>

          {/* 주요 업무 내용 */}
          <Divider titlePlacement="start" style={{ color: SECONDARY_TEXT, borderColor: BORDER_COLOR, margin: '30px 0 20px 0', fontSize: '15px'}}>
            주요 업무 내용
          </Divider>
          <div style={{ whiteSpace: 'pre-wrap', color: PRIMARY_TEXT, lineHeight: 1.8, fontSize: '15px' }}>
            {workLog.mainContent}
          </div>

          {/* 첨부 파일 */}
          <Divider titlePlacement="start" style={{ color: SECONDARY_TEXT, borderColor: BORDER_COLOR, margin: '40px 0 20px 0', fontSize: '15px' }}>
            첨부 파일
          </Divider>
          <div>
            <div 
              style={{ 
                border: `1px solid ${BORDER_COLOR}`, 
                borderRadius: '8px', 
                backgroundColor: '#262626',
                overflow: 'hidden'
              }}
            >
              {fileAttaches.length === 0 ? (
                <div style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Text style={{ color: SECONDARY_TEXT }}>첨부된 파일이 없습니다.</Text>
                </div>
              ) : (
                fileAttaches.map((file, index) => (
                  <div
                    key={file.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: index < fileAttaches.length - 1 ? `1px solid ${BORDER_COLOR}` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FileTextOutlined style={{ fontSize: '20px', color: SECONDARY_TEXT, marginRight: '10px' }} />
                      <div>
                        <span style={{ color: PRIMARY_TEXT, fontWeight: 500 }}>
                          {file.fileName}
                          <Text type="secondary" style={{ marginLeft: '10px', color: SECONDARY_TEXT, fontSize: '0.85em' }}> 
                            ({Math.round(file.fileSize / 1024)} KB)
                          </Text>
                        </span>
                      </div>
                    </div>
                    <a
                      href={getDownloadUrl(file.filePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={file.filePath}
                      key={`download-${file.id}`}
                    >
                      <Button
                        type="text" 
                        icon={<DownloadOutlined />}
                        style={{ color: ACCENT_COLOR }} 
                      >
                        다운로드
                      </Button>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 비고 */}
          <Divider titlePlacement="start" style={{ color: SECONDARY_TEXT, borderColor: BORDER_COLOR, margin: '40px 0 20px 0', fontSize: '15px' }}>비고</Divider>
          <div style={{ whiteSpace: 'pre-wrap', color: PRIMARY_TEXT, lineHeight: 1.8, fontSize: '15px', minHeight: '50px' }}>
            {workLog.sideContent || <Text type="secondary" style={{ color: SECONDARY_TEXT }}>-</Text>}
          </div>

          {/* 요약 내용 (조건부 렌더링) */}
          {workLog.summaryContent && (
            <>
              <Divider titlePlacement="start" style={{ color: SECONDARY_TEXT, borderColor: BORDER_COLOR, margin: '40px 0 20px 0', fontSize: '15px' }}>요약 내용</Divider>
              <Card
                title={<span style={{ color: PRIMARY_TEXT, fontWeight: 500 }}>분석 결과</span>}
                variant="outlined"
                style={{ backgroundColor: '#262626', borderColor: '#434343' }} 
                styles={{ header: { borderBottom: `1px solid #434343` } }}
              >
                <div style={{ whiteSpace: 'pre-wrap', color: PRIMARY_TEXT, lineHeight: 1.8 }}>
                  {workLog.summaryContent}
                </div>
              </Card>
            </>
          )}

          {/* 수정하기 버튼 */}
          <div style={{ marginTop: '40px', textAlign: 'right' }}>
            <Link to={`/Modify/${id}`}>
              {/* 버튼 크기 조정 유지 */}
              <Button type="primary" style={{ backgroundColor: ACCENT_COLOR, borderColor: ACCENT_COLOR, height: '44px', padding: '0 24px', fontWeight: 500, fontSize: '16px' }}>수정하기</Button>
            </Link>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}

export default Detail;