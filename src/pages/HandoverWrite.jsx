import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, Button, message } from 'antd';

const { RangePicker } = DatePicker;

function HandoverWrite() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (loading) return;

    setLoading(true);
    try {
      const { title, toName, toJob, fromJob, dateRange } = values;

      let fromDateStr = '';
      let toDateStr = '';
      if (dateRange && dateRange.length === 2) {
        fromDateStr = dateRange[0].format('YYYY-MM-DD');
        toDateStr = dateRange[1].format('YYYY-MM-DD');
      }

      // 👉 쿼리 파라미터 만들기 (title=...&toName=... 이런 문자열)
      const params = new URLSearchParams({
        title: title || '',
        toName: toName || '',
        toJob: toJob || '',
        fromJob: fromJob || '',
        fromDateStr: fromDateStr || '',
        toDateStr: toDateStr || '',
      }).toString();

      // 👉 fetch 호출 (세션 쓰니까 credentials: 'include' 꼭!)
      const response = await fetch(
        `http://localhost:8081/api/handover/download?${params}`,
        {
          method: 'GET',
          credentials: 'include', // JSESSIONID 쿠키 같이 보냄
        }
      );

      if (!response.ok) {
        throw new Error('서버 에러: ' + response.status);
      }

      // 👉 워드 파일(blob)로 받기
      const blob = await response.blob();

      // 👉 브라우저 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '인수인계서.docx'; // 저장될 파일 이름
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      message.success('인수인계서 다운로드가 완료되었습니다.');
    } catch (err) {
      console.error(err);
      message.error('인수인계서 생성/다운로드 중 오류가 발생했습니다.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center', // 🔹 가로 중앙
        marginTop: 24,
      }}
    >
        <Card 
            title="인수인계 작성" 
            variant="outlined"
            style={{
                width: '100%',
                maxWidth: 700,
                marginTop: 24,
            }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              title: '워크로그 프로젝트 인수인계',
            }}
          >
            <Form.Item
              label="인수인계 제목"
              name="title"
              rules={[{ required: true, message: '제목을 입력하세요.' }]}
            >
              <Input placeholder="예) 워크로그 프로젝트 인수인계" />
            </Form.Item>

            <Form.Item
              label="인수자 이름"
              name="toName"
              rules={[{ required: true, message: '인수자 이름을 입력하세요.' }]}
            >
              <Input placeholder="예) 김인수" />
            </Form.Item>

            <Form.Item
              label="인수자 부서/직위"
              name="toJob"
              rules={[{ required: true, message: '인수자 부서/직위를 입력하세요.' }]}
            >
              <Input placeholder="예) 개발팀 / 사원" />
            </Form.Item>

            <Form.Item
              label="내 부서/직위"
              name="fromJob"
              rules={[{ required: true, message: '내 부서/직위를 입력하세요.' }]}
            >
              <Input placeholder="예) 개발팀 / 주임" />
            </Form.Item>

            <Form.Item
              label="인수인계를 위한 기간"
              name="dateRange"
              rules={[{ required: true, message: '기간을 선택하세요.' }]}
            >
              <RangePicker />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                인수인계서 생성 및 다운로드
              </Button>
            </Form.Item>
          </Form>
        </Card>
    </div>
  );
}

export default HandoverWrite;
