import axios from "axios";
import type {
  ChzzkAuthRequest,
  ChzzkAuthResponse,
  ChzzkTokenRequest,
  ChzzkTokenResponse,
} from "../../types/chzzk";

const CHZZK_AUTH_URL = "https://chzzk.naver.com/account-interlock";
const CHZZK_TOKEN_URL = "https://api.chzzk.com/auth/v1/token";

export const requestAuthCode = async (
  params: ChzzkAuthRequest
): Promise<ChzzkAuthResponse> => {
  const response = await axios.get<ChzzkAuthResponse>(CHZZK_AUTH_URL, {
    params,
  });
  return response.data;
};

export const requestToken = async (
  params: ChzzkTokenRequest
): Promise<ChzzkTokenResponse> => {
  const response = await axios.post<ChzzkTokenResponse>(
    CHZZK_TOKEN_URL,
    params
  );
  return response.data;
};

export const refreshToken = async (
  params: Omit<ChzzkTokenRequest, "code" | "state">
): Promise<ChzzkTokenResponse> => {
  const response = await axios.post<ChzzkTokenResponse>(CHZZK_TOKEN_URL, {
    ...params,
    grantType: "refresh_token",
  });
  return response.data;
};
