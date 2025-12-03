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

// ✨ 수정된 SummaryTable 컴포넌트: 배열(테이블)을 찾지 못하면 객체의 Key-Value 쌍을 리스트로 출력
const SummaryTable = ({summaryJson, primaryText, secondaryText, borderColor}) => {
    let tableData = null;
    let fallbackData = null; // Key-Value 리스트 출력을 위한 데이터 변수

    if (summaryJson) {
        for (const key in summaryJson) {
            const value = summaryJson[key];

            // 1. 배열이고, 배열의 길이가 0 이상이며, 첫 번째 요소가 객체인 경우 (표 데이터로 가정)
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                tableData = value;
                break; // 첫 번째 표 데이터만 사용
            }
            
            // 2. 최상위 객체의 값 중 첫 번째로 발견된 유효한 객체를 Key-Value Fallback 데이터로 저장
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                // 단, "일일업무일지"와 같이 템플릿의 최상위 키를 건너뛰고 내부 객체를 fallback으로 잡기 위해
                // 첫 번째 키의 값이 객체인 경우 그 객체를 fallback으로 사용합니다. (한 번만 설정)
                if (fallbackData === null) { 					
                     fallbackData = value;
                }
            }
            // 최상위 객체 자체를 fallback으로 사용
            if (fallbackData === null && typeof summaryJson === 'object' && !Array.isArray(summaryJson)) {
                fallbackData = summaryJson;
            }
        }
    }
    
    // --- 1. 테이블 형태의 데이터(배열)가 있을 경우 (우선 순위 1) ---
    if (tableData && tableData.length > 0) {
        const data = tableData;
        const headers = Object.keys(data[0]); // 테이블 헤더 추출
        
        // 테이블 스타일
        const tableStyle = { 
            width: '100%', 
            borderCollapse: 'collapse', 
            color: primaryText,
            fontSize: '15px' 
        };
        const cellStyle = { 
            border: `1px solid ${borderColor}`, 
            padding: '12px 15px', 
            textAlign: 'left',
        };
        const headerStyle = {
            ...cellStyle,
            backgroundColor: '#303030', // 헤더 배경색
            color: PRIMARY_TEXT,
            fontWeight: '600'
        };
        const bodyRowStyle = {
            backgroundColor: 'transparent'
        };
        
        return (
            <table style={tableStyle}>
                {/* 1. 표 헤더 (<th>) */}
                <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header} style={headerStyle}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* 2. 표 본문 (<tr>, <td>) */}
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} style={bodyRowStyle}>
                            {headers.map(header => (
                                <td key={`${rowIndex}-${header}`} style={cellStyle}>
                                    {/* 데이터가 없으면 '-' 표시 */}
                                    {row[header] || <Text type="secondary" style={{ color: secondaryText }}>-</Text>}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );    
    }
    
    // --- 2. 테이블 데이터(배열)가 없고 Key-Value 형태의 요약 데이터가 있을 경우 (Fallback) ---
    if (fallbackData) {
        // null이나 빈 문자열인 값은 출력하지 않음
        const dataList = Object.entries(fallbackData).filter(([, value]) => 
            value !== null && value !== '' && !(typeof value === 'object' && Object.keys(value).length === 0)
        );
        
        // List 컴포넌트를 사용하여 깔끔하게 Key-Value 리스트 출력
        return (
            <List
                size="large"
                dataSource={dataList}
                style={{ backgroundColor: 'transparent', color: primaryText, fontSize: '15px' }}
                renderItem={([key, value]) => {
                    // 값이 또 다른 객체인 경우 (예: "금일업무": {"월": "10", "일": "10"}) 문자열로 변환하여 표시
                    let displayValue = value;
                    if (typeof value === 'object' && value !== null) {
                        displayValue = Object.entries(value)
                            .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
                            .join(', ');
                    }

                    return (
                        <List.Item 
                            style={{ borderBottom: `1px solid ${borderColor}`, padding: '12px 0' }}
                        >
                            <Row style={{ width: '100%' }} align="top">
                                {/* Key (항목 이름) */}
                                <Col span={6} style={{ fontWeight: '600', color: ACCENT_COLOR }}>
                                    {key}
                                </Col>
                                {/* Value (내용) */}
                                <Col span={18} style={{ color: primaryText, whiteSpace: 'pre-wrap' }}>
                                    {displayValue || <Text type="secondary" style={{ color: secondaryText }}>-</Text>}
                                </Col>
                            </Row>
                        </List.Item>
                    );
                }}
            />
        );
    }

    // --- 3. 데이터가 없을 경우 ---
    return <Text style={{ color: secondaryText }}>요약된 내용이 없습니다.</Text>;
}

// 디자인은 차후 수정 예정
function Detail() {
  const navigate = useNavigate();

  const { isLoginedId } = useContext(AuthContext);

  const { id } = useParams();
  const [workLog, setWorkLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileAttaches, setFileAttaches] = useState([]); // 파일들임

  const [summaryJsonData, setSummaryJsonData] = useState(null);
  const [summaryContentMarkdown, setSummaryContentMarkdown] = useState(null); // JSON이 아닌 원본 내용을 표시하기 위해 유지
  
  const extractPureJson = (text) => {
    if (!text) return null;
    
    // JSON 시작 문자 ({ 또는 [)의 인덱스를 찾습니다.
    const startIndex = text.search(/[\{\[]/);
    
    if (startIndex === -1) {
        console.warn("JSON 시작 문자({ 또는 [)를 찾을 수 없습니다.");
        // 순수 JSON 반환을 강제했으므로, 파싱 실패 시 원본 텍스트를 마크다운이 아닌 일반 텍스트로 간주하고 null 반환
        return null; 
    }
    
    // 시작 인덱스부터 끝까지 잘라냅니다.
    // AI가 여러 개의 JSON을 연달아 출력했을 때 (로그에서 발생), 첫 번째 JSON 객체의 끝을 정확히 찾는 것이 어려우므로
    // 일단 첫 번째 { 에서 시작하여 전체를 반환하도록 수정 (백엔드 프롬프트 강화를 통해 다중 JSON 문제를 해결해야 함)
    return text.substring(startIndex).trim();
  };

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
        
        if(fetchedData.summaryContent) {
            // summaryContent에 들어온 원본 텍스트 저장 (AI가 JSON을 반환하더라도, 혹시 모를 상황 대비)
            setSummaryContentMarkdown(fetchedData.summaryContent); 
            
            // AI가 여러 JSON을 연달아 반환했을 경우, 첫 번째 유효한 JSON만 파싱 시도
            let contentToParse = fetchedData.summaryContent;

            // 로그에서처럼 'AI 생성 Markdown 보고서:'와 같은 불필요한 텍스트 제거 시도
            const firstBrace = contentToParse.indexOf('{');
            if (firstBrace > 0) {
                contentToParse = contentToParse.substring(firstBrace);
            }

            try {
                // 순수한 JSON만 추출하는 함수 호출
                const pureJsonString = extractPureJson(contentToParse);
              
                if (pureJsonString) {
                    // JSON.parse가 유효한 단일 객체나 배열을 파싱할 수 있도록 보장해야 함.
                    // AI가 두 번째 JSON을 추가로 붙였을 경우 파싱이 실패할 수 있음.
                    // 이 부분은 백엔드 프롬프트 강화가 필수적입니다.
                    const parsedJson = JSON.parse(pureJsonString);
                    setSummaryJsonData(parsedJson);
                } else {
                    console.log("SummaryContent는 순수한 JSON이 아닌 것 같습니다. 일반 텍스트로 처리합니다.");
                    setSummaryJsonData(null); 
                }
                
            } catch (error) {
                // 파싱 실패 시 초기화 (summaryContentMarkdown은 그대로 유지)
                console.error("SummaryContent JSON 파싱 최종 실패:", error);
                setSummaryJsonData(null); 
            }
        } else {
            setSummaryJsonData(null);
            setSummaryContentMarkdown(null);
        }
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
              
              {/* 순수 JSON 파싱이 실패했을 경우, 원본 텍스트를 마크다운이 아닌 일반 텍스트로 표시 */}
              {!summaryJsonData && (
                <pre style={{ whiteSpace: 'pre-wrap', color: SECONDARY_TEXT, backgroundColor: '#262626', padding: '15px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
                  AI 보고서 파싱 실패 또는 테이블 형태 아님. 원본 내용:
                  {summaryContentMarkdown}
                </pre>
              )}

              {/* JSON 파싱 성공 시에만 테이블/리스트 출력 */}
              {summaryJsonData && (
                <Card
                  title={<span style={{ color: PRIMARY_TEXT, fontWeight: 500 }}>분석 결과</span>}
                  variant="outlined"
                  style={{ backgroundColor: '#262626', borderColor: '#434343' }} 
                  styles={{ header: { borderBottom: `1px solid #434343` } }}
                >
                  <SummaryTable 
                    summaryJson={summaryJsonData} 
                    primaryText={PRIMARY_TEXT}
                    secondaryText={SECONDARY_TEXT}
                    borderColor={BORDER_COLOR}
                  />
                </Card>
              )}
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