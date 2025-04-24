import { useState } from "react";
import { Link } from "react-router-dom";

interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  sentiment: number;
}

const mockChatData: ChatMessage[] = [
  {
    id: "1",
    username: "user123",
    content: "안녕하세요! 오늘도 재미있는 방송 감사합니다!",
    timestamp: "2024-03-20 19:00:00",
    sentiment: 0.8,
  },
  {
    id: "2",
    username: "user123",
    content: "이번 게임 정말 재미있네요!",
    timestamp: "2024-03-20 19:05:00",
    sentiment: 0.9,
  },
  {
    id: "3",
    username: "user123",
    content: "아쉽네요... 다음에는 이길 수 있을 거예요!",
    timestamp: "2024-03-20 19:10:00",
    sentiment: 0.3,
  },
];

export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState("user123");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="w-full max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              스트림 채팅 모니터
            </h1>
            <nav className="flex space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                실시간 모니터링
              </Link>
              <Link
                to="/users"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                유저 분석
              </Link>
              <Link
                to="/sentiment"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                감정 분석
              </Link>
              <Link
                to="/banned"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                악성 유저 관리
              </Link>
              <Link
                to="/settings"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                설정
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-8 mt-32 mb-32">
        <div className="w-full max-w-5xl mx-auto h-[calc(100vh-16rem)] flex flex-col">
          {/* User Selection */}
          <div className="mb-8 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              유저 선택
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="block w-full max-w-xs mx-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="user123">user123</option>
              <option value="user456">user456</option>
              <option value="user789">user789</option>
            </select>
          </div>

          {/* Chat Messages */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden flex-1 flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium text-gray-900 text-center">
                {selectedUser}의 채팅 기록
              </h2>
            </div>
            <div className="divide-y divide-gray-200 flex-1 overflow-y-auto">
              {mockChatData
                .filter((chat) => chat.username === selectedUser)
                .map((chat) => (
                  <div key={chat.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">
                          {chat.timestamp}
                        </p>
                        <p className="mt-2 text-gray-900 text-lg">
                          {chat.content}
                        </p>
                      </div>
                      <div className="ml-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            chat.sentiment > 0.6
                              ? "bg-green-100 text-green-800"
                              : chat.sentiment < 0.4
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          감정 지수: {chat.sentiment.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow fixed bottom-0 left-0 right-0 z-10">
        <div className="w-full max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-2 gap-12">
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                만든 사람
              </h3>
              <p className="text-sm text-gray-500">
                Dominic – Back-end 기반 Web Developer, 스트리밍을 좋아하는
                창작형 엔지니어
              </p>
              <div className="mt-6 space-x-6">
                <a
                  href="https://do-mi.tistory.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  블로그
                </a>
                <a
                  href="mailto:kimduumin@gmail.com"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Email
                </a>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                프로젝트 정보
              </h3>
              <p className="text-sm text-gray-500">
                실시간 스트리밍 채팅과 오디오를 분석하여, 시청자의 활동 및 감정
                흐름을 시각적으로 보여주는 대시보드 UI입니다.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © 2024 Stream Chat Monitor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
