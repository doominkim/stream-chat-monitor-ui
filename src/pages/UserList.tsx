import { Link } from "react-router-dom";

interface User {
  id: string;
  username: string;
  chatCount: number;
  lastActive: string;
  sentiment: number;
  isBanned: boolean;
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "user123",
    chatCount: 156,
    lastActive: "2024-03-20 19:10:00",
    sentiment: 0.8,
    isBanned: false,
  },
  {
    id: "2",
    username: "user456",
    chatCount: 89,
    lastActive: "2024-03-20 19:05:00",
    sentiment: 0.3,
    isBanned: true,
  },
  {
    id: "3",
    username: "user789",
    chatCount: 234,
    lastActive: "2024-03-20 19:15:00",
    sentiment: 0.9,
    isBanned: false,
  },
];

export default function UserList() {
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
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium text-gray-900">유저 목록</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <Link
                  key={user.id}
                  to={`/users/${user.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.username}
                          </h3>
                          {user.isBanned && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              차단됨
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          마지막 활동: {user.lastActive}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          채팅 수: {user.chatCount}
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.sentiment > 0.6
                              ? "bg-green-100 text-green-800"
                              : user.sentiment < 0.4
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          감정 지수: {user.sentiment.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
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
