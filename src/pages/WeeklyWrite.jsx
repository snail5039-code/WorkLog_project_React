import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DatePicker, Card, Typography, Spin, message } from "antd";
import { AuthContext } from "../context/AuthContext";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function WeeklyWrite() {
  const [week, setWeek] = useState(null); // 선택한 주
  const [logs, setLogs] = useState([]); // 조회한 업무 일지
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const handleWeekChange = async (value) => {
    setWeek(value);
    if (!value) {
      setLogs([]);
      setSummary("");
      return;
    }

    try {
      setLoading(true);

      const start = value.startOf("week"); // 주 시작
      const end = value.endOf("week"); // 주 끝

      const startStr = start.format("YYYY-MM-DD");
      const endStr = end.format("YYYY-MM-DD");

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

      const summaryRes = await fetch(
        `http://localhost:8081/api/workLog/weekly/summary?startDate=${startStr}&endDate=${endStr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("주간 요약 생성 실패!");
      }
      const summaryData = await summaryRes.json();
      setSummary(summaryData.summary || "");
    } catch (error) {
      console.error(error);
      message.error("업무일지를 불러오는 중 오류가 발생했습니다.");
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Title level={3}>주간 업무일지 작성</Title>

      {/* 주 선택 카드임 */}
      <Card className="mb-4">
        <Text strong>주 선택</Text>
        <br />
        <DatePicker
          picker="week"
          value={week}
          onChange={handleWeekChange}
          placeholder="주를 선택해주세요."
          style={{ marginTop: 8 }}
        />
      </Card>

      {/* 조회 결과 카드임 */}
      <Card>
        <Title level={5}>선택한 주의 일일 업무일지</Title>
        {loading ? (
          <Spin />
        ) : (
          <>
            {logs.length === 0 ? (
              <Text type="secondary">
                선택한 주에 해당하는 업무일지가 없거나 아직 주를 선택하지
                않았습니다.
              </Text>
            ) : (
              <ul>
                {logs.map((log) => (
                  <li key={log.id}>
                    [{log.regDate?.substring(0, 10)}] {log.title}
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
export default WeeklyWrite;
