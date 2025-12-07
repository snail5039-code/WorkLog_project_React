// src/pages/MyPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  message,
} from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const LOGIN_REQUIRED_KEY = 'login_required_message';

// ✨ 디자인 색상(밝고 전문적인 느낌)
const PAGE_BG = '#f5f5f5';
const CARD_BG = '#ffffff';
const BORDER_COLOR = '#e5e5e5';
const PRIMARY_TEXT = '#111827';
const SECONDARY_TEXT = '#6b7280';
const ACCENT_COLOR = '#2563eb';

function MyPage() {
  const navigate = useNavigate();
  const { isLoginedId } = useContext(AuthContext);
  const isLoggedIn = isLoginedId !== 0;

  // 요약 정보
  const [summary, setSummary] = useState({
    totalCount: 0,
    thisMonthCount:0,
  });
  // 내 업무일지 목록
  const [myWorkLogs, setMyWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      message.error({
        content: '마이페이지는 로그인 후 이용 가능합니다.',
        key: LOGIN_REQUIRED_KEY,
        duration: 5,
      });
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  // ✅ 마이페이지 데이터 불러오기
  useEffect(() => {
    // 👉 백엔드에서 이런 API를 하나 만들어주면 좋음:
    // GET /api/usr/mypage/summary
    // GET /api/usr/mypage/worklogs?page=0&size=10

    async function fetchData() {
      setLoading(true);
      try {
        // --- 1) 요약 정보 호출 ---
        const summaryRes = await fetch(
          `http://localhost:8081/api/usr/workLog/myPageSummary?page=${page}&size=${pageSize}`,
          {
            credentials: 'include',
          }
        );

        if (!summaryRes.ok) {
          throw new Error('요약 정보 조회 실패');
        }
        const data = await summaryRes.json();
        console.log(
          '백엔드 응답:',
          'totalCount =', data.summary?.totalCount,
          'myWorkLogs.length =', (data.myWorkLogs || []).length
        );
        setSummary(data.summary || { totalCount: 0, thisMonthCount: 0});
        setMyWorkLogs(data.myWorkLogs || []);

      } catch (error) {
        console.error(error);
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoggedIn, page, pageSize]);

  // 테이블 컬럼 정의
  const columns = [
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link
          to={`/detail/${record.id}`}
          style={{ color: ACCENT_COLOR, fontWeight: 500 }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: '템플릿',
      dataIndex: 'templateId',
      key: 'templateId',
      render: (value, record) => (
        <Tag color="geekblue">
          {record.templateName
            ? `${record.templateName} (${value})`
            : value || 'TPL1'}
        </Tag>
      ),
    },
    {
      title: '유형',
      dataIndex: 'boardType',
      key: 'boardType',
      render: (value) => {
        // 예: DAILY / WEEKLY / MONTHLY / HANDOVER 등
        const map = {
          DAILY: '일일',
          WEEKLY: '주간',
          MONTHLY: '월간',
          HANDOVER: '인수인계',
        };
        return (
          <Tag color="cyan">
            {map[value] || value || '기타'}
          </Tag>
        );
      },
    },
    {
      title: '작성일',
      dataIndex: 'regDate',
      key: 'regDate',
      render: (value) => (
        <span style={{ color: SECONDARY_TEXT, fontSize: 13 }}>{value}</span>
      ),
    },
    {
      title: 'AI 요약',
      dataIndex: 'summaryExists',
      key: 'summaryExists',
      align: 'center',
      render: (value) =>
        value ? (
          <Tag color="green">완료</Tag>
        ) : (
          <Tag color="default">없음</Tag>
        ),
    },
  ];

  return (
    <Layout
      style={{
        minHeight: '100vh',
        backgroundColor: PAGE_BG,
        padding: '32px 16px',
      }}
    >
      <Content
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* 상단: 제목 + 버튼 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <Title
              level={2}
              style={{
                color: PRIMARY_TEXT,
                marginBottom: 4,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              마이페이지
            </Title>
            <Text style={{ color: SECONDARY_TEXT, fontSize: 14 }}>
              내가 작성한 업무일지를 한눈에 모아보고, AI 보고서도 쉽게 관리해요.
            </Text>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >

            <Button
              type="primary"
              onClick={() => navigate('/write')}
              style={{
                backgroundColor: ACCENT_COLOR,
                borderColor: ACCENT_COLOR,
                height: 40,
                padding: '0 18px',
                fontWeight: 500,
              }}
            >
              개인정보 수정
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/write')}
              style={{
                backgroundColor: ACCENT_COLOR,
                borderColor: ACCENT_COLOR,
                height: 40,
                padding: '0 18px',
                fontWeight: 500,
              }}
            >
              새 업무일지 작성
            </Button>
          </div>
        </div>

        {/* 상단 요약 카드들 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card
              style={{
                backgroundColor: CARD_BG,
                borderColor: BORDER_COLOR,
                borderRadius: 14,
                boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
              }}
            >
              <Statistic
                title={<span style={{ color: SECONDARY_TEXT }}>총 작성 개수</span>}
                value={summary?.totalCount ?? 0}
                styles={{ color: PRIMARY_TEXT, fontSize: 26 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                backgroundColor: CARD_BG,
                borderColor: BORDER_COLOR,
                borderRadius: 14,
                boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
              }}
            >
              <Statistic
                title={
                  <span style={{ color: SECONDARY_TEXT }}>
                    이번 달 작성 개수
                  </span>
                }
                value={summary?.thisMonthCount ?? 0}
                styles={{ color: '#059669', fontSize: 26 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                backgroundColor: CARD_BG,
                borderColor: BORDER_COLOR,
                borderRadius: 14,
                boxShadow: '0 12px 30px rgba(15,23,42,0.06)',
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <Text style={{ color: SECONDARY_TEXT, fontSize: 13 }}>
                  마지막 작성일
                </Text>
              </div>
              <div>
                <Text
                  style={{
                    color: PRIMARY_TEXT,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  {summary?.lastWrittenDate
                    ? summary.lastWrittenDate.replace('T', ' ')
                    : '-'}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 템플릿 사용 현황 */}
        <Card
          style={{
            backgroundColor: CARD_BG,
            borderColor: BORDER_COLOR,
            borderRadius: 14,
            boxShadow: '0 12px 30px rgba(15,23,42,0.04)',
            marginBottom: 24,
          }}
          title={
            <span style={{ color: PRIMARY_TEXT, fontWeight: 500 }}>
              자주 사용하는 템플릿
            </span>
          }
        >
          {summary?.topTemplates && summary.topTemplates.length > 0 ? (
            <Row gutter={[12, 12]}>
              {summary.topTemplates.map((tpl) => (
                <Col key={tpl.templateId} xs={24} sm={8}>
                  <Card
                    size="small"
                    style={{
                      backgroundColor: '#f9fafb',
                      borderColor: BORDER_COLOR,
                      borderRadius: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: PRIMARY_TEXT,
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        {tpl.templateName || tpl.templateId}
                      </Text>
                      <Text
                        style={{
                          color: ACCENT_COLOR,
                          fontWeight: 500,
                          fontSize: 13,
                        }}
                      >
                        {tpl.count}회 작성
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Text style={{ color: SECONDARY_TEXT, fontSize: 13 }}>
              아직 템플릿 사용 통계가 없습니다. 업무일지를 작성해보세요.
            </Text>
          )}
        </Card>

        {/* 내 업무일지 목록 */}
        <Card
          style={{
            backgroundColor: CARD_BG,
            borderColor: BORDER_COLOR,
            borderRadius: 14,
            boxShadow: '0 12px 30px rgba(15,23,42,0.04)',
          }}
          title={
            <span style={{ color: PRIMARY_TEXT, fontWeight: 500 }}>
              최근 작성한 업무일지
            </span>
          }
          extra={
            <Link to="/list">
              <Button type="link" icon={<FileTextOutlined />}>
                전체 목록으로 이동
              </Button>
            </Link>
          }
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={myWorkLogs}
            loading={loading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: summary?.totalCount ?? 0,
              showSizeChanger: true,
            }} 
            onChange={(pagination)  => {
              console.log('페이지 변경:', pagination) // 테스트용
              setPage(pagination.current);
              setPageSize(pagination.pageSize);
            }}
            size="middle"
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default MyPage;
