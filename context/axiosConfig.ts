import axios from "axios";

// 세션/쿠키 자동 포함
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401은 "로그인 안 함" 상태로 간주하고 그냥 내려보냄
    if (status === 401) {
      // redirect 하지 않음!
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axios;
