# stream-chat-monitor-ui 🎛️

실시간 스트리밍 채팅과 오디오를 분석하여,  
시청자의 활동 및 감정 흐름을 시각적으로 보여주는 대시보드 UI입니다.

## 🔍 프로젝트 소개

`stream-chat-monitor-ui`는 스트리머의 오디오와 시청자 채팅 로그를 실시간으로 수집하고,  
이를 AI 기반 분석으로 처리하여 **재미 요소**, **악성 유저**, **감정 흐름** 등을  
**시각적으로 표현하는 웹 인터페이스**입니다.

> "유저의 채팅은 그저 텍스트가 아닙니다. 반응이고, 감정이고, 콘텐츠입니다."

### 주요 기능

- 🎙 Whisper 기반 오디오 텍스트 변환 및 감정 태깅
- 💬 실시간 채팅 흐름 수집 및 이상 행동 탐지
- 🔍 특정 유저의 활동 로그 분석 (e.g. 시비 유도, 도배 등)
- 📊 감정 분포/이벤트 트리거 시각화
- 🧠 생성형 AI를 통한 요약/분석 결과 제공 (예: 하이라이트 요약, 키워드 추출)

## ⚙️ 기술 스택

- **React** + **Vite**
- **TypeScript**
- **Recharts / D3** for Data Visualization
- **TailwindCSS** for Styling
- **WebSocket** for Real-time Data Feed
- 외부 서비스: Whisper API / OpenAI / Custom LLM Pipeline

## 📁 디렉토리 구조

📦stream-chat-monitor-ui
┣ 📂src
┃ ┣ 📂components # 시각화 컴포넌트들
┃ ┣ 📂pages # 대시보드 및 서브 화면
┃ ┣ 📂hooks # 커스텀 훅 모음
┃ ┣ 📂services # WebSocket, API 통신
┃ ┗ 📜App.tsx # 메인 진입점
┣ 📜vite.config.ts
┗ 📜README.md

## 🚀 개발 동기

스트리밍은 더 이상 일방향 콘텐츠가 아닙니다.  
시청자는 참여자이며, 채팅과 반응은 하나의 데이터 흐름입니다.  
이 프로젝트는 그 데이터를 통해 **어떤 재미가 발생하고 있는지**,  
**어떤 유저가 분위기를 주도하고 있는지**를 보여주는 인터페이스를 목표로 합니다.

## 📎 TODO

- [ ] AI 분석 결과 기반 하이라이트 클립 API 연동
- [ ] 유저별 활동 프로파일링 기능 추가
- [ ] 감정/주제 별 시청자 히트맵 구현
- [ ] 관리자용 악성 유저 신고 UI

## 🧑‍💻 만든 사람

Dominic – Back-end 기반 Web Developer, 스트리밍을 좋아하는 창작형 엔지니어  
[블로그](https://do-mi.tistory.com/) | [Email](mailto:kimduumin@gmail.com)
