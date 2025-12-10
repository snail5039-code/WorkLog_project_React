// src/pages/MonthlyWrite.jsx
import React, { useState } from "react";
import { DatePicker, Card, Typography, Spin, message } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function MonthlyWrite() {
  const [month, setMonth] = useState(null); // 선택한 월
  const [logs, setLogs] = useState([]);     // 조회한 업무 일지
  const [loading, setLoading] = useState(false);

  const handleMonthChange = async (value) => {
    setMonth(value); // 선택한 월 기억하기

    if (!value) {
      setLogs([]);
      return;
    }

    try {
      setLoading(true);

      // 이 달의 시작 / 끝 계산
      const start = value.startOf("month");
      const end = value.endOf("month");

      const startStr = start.format("YYYY-MM-DD");
      const endStr = end.format("YYYY-MM-DD");

      // 백엔드: 주간이랑 똑같이 /workLog/range 사용
      const res = await fetch(
        `http://localhost:8081/api/workLog/range?startDate=${startStr}&endDate=${endStr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("서버가 응답하지 않습니다.");
      }

      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error(error);
      message.error("업무일지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Title level={3}>월간 업무일지 작성</Title>

      {/* 월 선택 카드 */}
      <Card className="mb-4">
        <Text strong>월 선택</Text>
        <br />
        <DatePicker
          picker="month"          // ⭐ 여기만 month
          value={month}
          onChange={handleMonthChange}
          placeholder="월을 선택해주세요."
          style={{ marginTop: 8 }}
        />
      </Card>

      {/* 조회 결과 카드 */}
      <Card>
        <Title level={5}>선택한 월의 일일 업무일지</Title>

        {loading ? (
          <Spin />
        ) : (
          <>
            {logs.length === 0 ? (
              <Text type="secondary">
                선택한 월에 해당하는 업무일지가 없거나 아직 월을 선택하지 않았습니다.
              </Text>
            ) : (
              <ul>
                {logs.map((log) => (
                  <li key={log.id}>
                    [{String(log.regDate).substring(0, 10)}] {log.title}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default MonthlyWrite;
