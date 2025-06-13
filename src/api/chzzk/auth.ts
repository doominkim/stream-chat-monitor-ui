import axios from "axios";
import type {
  ChzzkAuthRequest,
  ChzzkAuthResponse,
  ChzzkTokenRequest,
  ChzzkTokenResponse,
} from "../../types/chzzk";

export const CHZZK_AUTH_URL = "https://chzzk.naver.com/account-interlock";
const CHZZK_TOKEN_URL = "https://chzzk.naver.com/auth/v1/token";
const CHZZK_TOKEN_REVOKE_URL = "https://chzzk.naver.com/auth/v1/token/revoke";

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

export const revokeToken = async (
  clientId: string,
  clientSecret: string,
  token: string,
  tokenTypeHint: "access_token" | "refresh_token" = "access_token"
): Promise<void> => {
  await axios.post(CHZZK_TOKEN_REVOKE_URL, {
    clientId,
    clientSecret,
    token,
    tokenTypeHint,
  });
};
