import axios from "axios";

const BASE_URL = "http://121.167.129.36:3000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // TODO: 토큰이 필요한 경우 여기에 추가
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 에러 처리 로직 추가
    return Promise.reject(error);
  }
);

export default apiClient;
