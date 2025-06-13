import axios from "axios";
import type { ChzzkAuthRequest, ChzzkAuthResponse } from "../../types/chzzk";

export const CHZZK_AUTH_URL = "https://chzzk.naver.com/account-interlock";

export const requestAuthCode = async (
  params: ChzzkAuthRequest
): Promise<ChzzkAuthResponse> => {
  const response = await axios.get<ChzzkAuthResponse>(CHZZK_AUTH_URL, {
    params,
  });
  return response.data;
};
