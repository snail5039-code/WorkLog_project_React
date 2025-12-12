import React, { useState } from "react";

function SiteChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "이 사이트 내용을 기반으로 도와드릴게요 😊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    // 1) 화면에 내 질문 먼저 추가
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 세션 쓰면 그대로 유지
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "서버 오류");
      }

      const data = await res.json();
      const answer = data.answer || "서버에서 내용이 비어있게 왔어요.";

      // 2) 챗봇 답변 추가
      setMessages((prev) => [...prev, { from: "bot", text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `에러가 발생했습니다: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "12px",
      maxWidth: "500px",
      height: "400px",
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      color: "#000",          // ✅ 전체 기본 글자색을 검정으로
      fontSize: "14px",
    }}
    >
      {/* 대화 내용 영역 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "8px",
          padding: "4px",
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              textAlign: m.from === "user" ? "right" : "left",
              margin: "4px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: "12px",
                background: m.from === "user" ? "#007bff" : "#f1f1f1",
                color: m.from === "user" ? "#fff" : "#000",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ fontSize: "0.9rem", color: "#888" }}>
            답변 생성 중...
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          style={{ width: "100%", resize: "none" }}
          placeholder="질문을 입력하고 Enter를 눌러보세요"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ marginTop: "4px", width: "100%" }}
        >
          보내기
        </button>
      </div>
    </div>
  );
}

export default SiteChatBot;
