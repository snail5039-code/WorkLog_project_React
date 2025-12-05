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


// ⭐️ [추가] NestedTable 컴포넌트: 배열 형태의 데이터를 HTML 테이블로 렌더링하는 보조 컴포넌트
// 여기는 서머리 테이블에서 배열인 것들을 가져와서 하나씩 출력하는 건데 그거는 제목, 날짜 이런것들임 !
const NestedTable = ({data, primaryText, secondaryText, borderColor}) => {
    if (!data || data.length === 0) return null;
    
    // 테이블 헤더 추출
    const headers = Object.keys(data[0]); 
    
    // 테이블 스타일 정의
    const tableStyle = { 
        width: '100%', 
        borderCollapse: 'collapse', 
        color: primaryText,
        fontSize: '14px' // 중첩된 테이블이므로 약간 작게
    };
    const cellStyle = { 
        border: `1px solid ${borderColor}`, 
        padding: '10px 12px', 
        textAlign: 'left',
    };
    const headerStyle = {
        ...cellStyle,
        backgroundColor: '#383838', // 헤더 배경색
        color: PRIMARY_TEXT,
        fontWeight: '600'
    };
    const bodyRowStyle = {
        backgroundColor: 'transparent'
    };

    return (
        <table style={tableStyle}>
            {/* 표 헤더 */}
            <thead>
                <tr>
                    {headers.map(header => (
                        <th key={header} style={headerStyle}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            {/* 표 본문 */}
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


// ✨ [수정] SummaryTable 컴포넌트: JSON 객체 내의 모든 키-값 쌍을 리스트 형태로 유연하게 출력합니다.
// 배열(테이블)을 발견하면 NestedTable을 호출하여 중첩 렌더링하고, 단일 값은 리스트 아이템으로 출력합니다.
// 배열빼고 순회하면서 출력하는 거임! 근데 밑에 출력할 때는 안티 디자인 리스트 효과 때문에 자동적으로 데이터가 많으면 줄이 생김!
const SummaryTable = ({summaryJson, primaryText, secondaryText, borderColor}) => {
    
    if (!summaryJson || Object.keys(summaryJson).length === 0) {
        return <Text style={{ color: secondaryText }}>AI 요약 데이터가 없습니다.</Text>;
    }
    
    // JSON 객체의 모든 키를 순회하며 출력할 데이터 리스트를 만듭니다.
    const dataList = Object.entries(summaryJson).map(([key, value], index) => {
        let displayValue;
        let isTable = false;

        // 1. 값이 배열이고, 배열의 길이가 0 이상이며, 첫 번째 요소가 객체인 경우 (표 데이터)
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            isTable = true;
            // NestedTable 컴포넌트를 호출하여 하위 테이블을 렌더링합니다.
            displayValue = (
                <NestedTable
                    data={value}
                    primaryText={primaryText}
                    secondaryText={secondaryText}
                    borderColor={borderColor}
                    key={key}
                />
            );
        } 
        // 2. 값이 비어있지 않은 객체일 경우 (중첩된 객체일 경우)
        else if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
            // 중첩된 객체를 문자열로 변환하여 표시 (예: "팀: 개발, 이름: 홍길동")
            displayValue = Object.entries(value)
                .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
                .join(', ');
        }
        // 3. 그 외 단일 값 (문자열, 숫자 등)
        else {
            displayValue = value;
        }

        return { key, displayValue, isTable };
    // 값이 없는 항목(null, "")은 출력하지 않습니다.
    }).filter(item => item.displayValue !== null && item.displayValue !== ''); 
    
    // Ant Design List 컴포넌트로 모든 필드를 출력합니다.
    return (
        <List
            size="large"
            dataSource={dataList}
            style={{ backgroundColor: 'transparent', color: primaryText, fontSize: '15px' }}
            renderItem={(item) => (
                <List.Item 
                    style={{ 
                        borderBottom: `1px solid ${borderColor}`, 
                        padding: item.isTable ? '20px 0' : '12px 0' // 테이블일 경우 패딩을 넓게 줍니다.
                    }}
                >
                    <Row style={{ width: '100%' }} align="top">
                        {/* Key (항목 이름) */}
                        {/* 테이블일 경우 전체 너비를 사용하고, 아니면 6/24 비율로 사용 */}
                        <Col span={item.isTable ? 24 : 6} style={{ fontWeight: '600', color: ACCENT_COLOR, marginBottom: item.isTable ? '15px' : '0' }}>
                             {/* 테이블일 경우 제목처럼 크게 표시 */}
                             {item.isTable ? <Title level={5} style={{ color: PRIMARY_TEXT, margin: 0 }}>{item.key} (세부 업무)</Title> : item.key}
                        </Col>
                        {/* Value (내용) */}
                        {/* 테이블일 경우 전체 너비를 사용하고, 아니면 18/24 비율로 사용 */}
                        <Col span={item.isTable ? 24 : 18} style={{ color: primaryText, whiteSpace: 'pre-wrap' }}>
                             {/* 값 출력. 테이블 데이터는 NestedTable 컴포넌트가 이미 포함되어 있습니다. */}
                            {item.displayValue || <Text type="secondary" style={{ color: secondaryText }}>-</Text>}
                        </Col>
                    </Row>
                </List.Item>
            )}
        />
    );
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
  
  // 🚨 [수정된 로직] JSON 문자열에서 불필요한 마크다운 백틱(`)이나 설명 텍스트를 제거하고 순수한 JSON을 추출합니다.
  const extractPureJson = (text) => {
    if (!text) return null;

    // 1. JSON 시작 문자 ({ 또는 [)의 인덱스를 찾습니다.
    const startIndex = text.search(/[\{\[]/);
    if (startIndex === -1) {
        console.warn("JSON 시작 문자({ 또는 [)를 찾을 수 없습니다.");
        return null;
    }

    // 2. 시작 인덱스부터 문자열의 끝까지의 서브스트링을 준비합니다.
    let pureJsonCandidate = text.substring(startIndex).trim();

    // 3. JSON의 끝 인덱스를 찾습니다. (가장 마지막에 나오는 } 또는 ]의 위치를 찾습니다)
    let endIndex = -1;
    let lastBrace = pureJsonCandidate.lastIndexOf('}');
    let lastBracket = pureJsonCandidate.lastIndexOf(']');

    // 가장 뒤에 나오는 닫는 괄호나 대괄호를 JSON의 끝으로 간주합니다.
    if (lastBrace > lastBracket) {
        endIndex = lastBrace;
    } else if (lastBracket > -1) {
        endIndex = lastBracket;
    }

    // 4. 끝 인덱스를 찾았다면 (그리고 시작 인덱스보다 뒤에 있다면),
    // 시작부터 끝까지 (+1을 하여 닫는 괄호 포함) 잘라냅니다.
    if (endIndex !== -1 && endIndex > 0) {
        // pureJsonCandidate는 0부터 시작하므로 endIndex + 1을 사용합니다.
        pureJsonCandidate = pureJsonCandidate.substring(0, endIndex + 1).trim();
    } else {
        // 끝을 찾지 못했다면 파싱을 시도하지 않습니다. (JSON이 제대로 닫히지 않음)
        console.warn("JSON 닫는 문자(} 또는 ])를 찾을 수 없습니다.");
        return null; 
    }

    // 5. 최종 추출된 순수한 JSON 후보 문자열을 반환합니다.
    return pureJsonCandidate;
  };
  // 🚨 [수정된 로직 끝]

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
            // summaryContent에 들어온 원본 텍스트 저장 
            setSummaryContentMarkdown(fetchedData.summaryContent); 
            
            let contentToParse = fetchedData.summaryContent;

            try {
                // ⭐️ [수정된 부분] 순수한 JSON만 추출하는 함수 호출
                const pureJsonString = extractPureJson(contentToParse);
              
                if (pureJsonString) {
                    // JSON.parse가 유효한 단일 객체나 배열을 파싱할 수 있도록 보장해야 함.
                    const parsedJson = JSON.parse(pureJsonString);
                    setSummaryJsonData(parsedJson);
                } else {
                    console.log("SummaryContent는 순수한 JSON이 아닌 것 같습니다. 일반 텍스트로 처리합니다.");
                    setSummaryJsonData(null); 
                }
                
            } catch (error) {
                // 파싱 실패 시 초기화 
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
//ai 요약본 파일 생성해서 다운로드 하는 것!
  const handleDownloadSummary = () => {
    if (!summaryContentMarkdown) {
      message.error("다운로드할 요약 내용이 없습니다.");
      return;
    }
        try {
            // 파일 내용을 Blob 객체로 생성 (마크다운 텍스트), blob로 해야 마크다운 텍스트를 담을 수 있음 
            const blob = new Blob([summaryContentMarkdown], { type: 'text/markdown;charset=utf-8' });

            // a 태그를 생성하여 다운로드 링크를 만듭니다.
            const url = URL.createObjectURL(blob); // blob 객체 접근 할 수 있게 임시 주소 생성
            const a = document.createElement('a');
            a.href = url;
            // 쉽게 여기서 보이지는 않는 url을 만들어서 
            
            // 파일 이름 설정 (제목 기반)
            const fileName = workLog.title 
                ? `${workLog.title.replace(/[^a-z0-9]/gi, '_')}_AI_Summary.md`//특수문자 없에고 붙이는 거임
                : `WorkLog_${id}_AI_Summary.md`;
            
            a.download = fileName;
            
            // 여기서 호출해서 다운로드를 받는데 끝나면 메모리 해제를 통해 누수를 방지
            // 다운로드 실행
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // 메모리 해제

            message.success(`'${fileName}' 다운로드를 시작합니다.`);
          //쉽게 말해서 ai는 요약한걸 임시 메모리에 가지고 있다가 그 주소를 보이지 않게 만들어서 클릭하면 이동해서 다운 받고 메모리 해제해서 누수 막는다는거

        } catch (error) {
            console.error("AI 요약 다운로드 실패:", error);
            message.error("요약 파일 다운로드에 실패했습니다.");
        }
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

          {/* 메타 정보 (작성자, 작성일) - DB 원본 */}
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
            <Space size="middle" style={{ marginTop: '5px', marginBottom: '15px' }}>

              {/* AI 요약본 다운로드 */}
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadSummary}
                  style={{ 
                      backgroundColor: ACCENT_COLOR, 
                      borderColor: ACCENT_COLOR, 
                      fontSize: '14px', 
                      padding: '0 15px', 
                      height: '34px',
                  }}
                >
                  AI 요약본 다운로드 (.md)
                </Button>

                {/* 자동 생성된 DOCX 다운로드 */}
                {workLog.docxPath && (
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      window.location.href = getDownloadUrl(workLog.docxPath);
                    }}
                    style={{
                      backgroundColor: '#52c41a',
                      borderColor: '#52c41a',
                      fontSize: '14px',
                      padding: '0 15px',
                      height: '34px',
                      color: '#141414'
                    }}
                  >
                    자동 생성된 DOCX 다운로드
                  </Button>
                )}

                {/* ⭐⭐⭐ 템플릿 DOCX 다운로드 버튼 추가됨 ⭐⭐⭐ */}
                {workLog.documentType && (
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      // 문서양식 번호로 템플릿 다운로드 API 호출
                      window.location.href = `http://localhost:8081/api/usr/work/template/${workLog.documentType}`;
                    }}
                    style={{
                      backgroundColor: '#ffa940',
                      borderColor: '#ffa940',
                      fontSize: '14px',
                      padding: '0 15px',
                      height: '34px',
                      color: '#141414'
                    }}
                  >
                    선택한 템플릿 DOCX 다운로드
                  </Button>
                )}
                {/* ⭐⭐⭐ 추가 끝 ⭐⭐⭐ */}
            </Space>
              <Divider titlePlacement="start" style={{ color: SECONDARY_TEXT, borderColor: BORDER_COLOR, margin: '40px 0 20px 0', fontSize: '15px' }}>AI 분석 요약 내용</Divider>
              
              {/* 순수 JSON 파싱이 실패했을 경우, 원본 텍스트를 마크다운이 아닌 일반 텍스트로 표시 */}
              {!summaryJsonData && (
                <pre style={{ whiteSpace: 'pre-wrap', color: SECONDARY_TEXT, backgroundColor: '#262626', padding: '15px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
                  AI 보고서 파싱 실패 또는 JSON 형식이 아님. 원본 내용:
                  {summaryContentMarkdown}
                </pre>
              )}

              {/* JSON 파싱 성공 시에만 SummaryTable을 호출하여 모든 JSON 데이터를 출력 */}
              {summaryJsonData && (
                <Card
                  title={<span style={{ color: PRIMARY_TEXT, fontWeight: 500 }}>AI 분석 결과</span>}
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