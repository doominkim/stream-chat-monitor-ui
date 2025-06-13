export interface ChzzkAuthRequest {
  clientId: string;
  redirectUri: string;
  state: string;
}

export interface ChzzkAuthResponse {
  code: string;
  state: string;
}

export interface ChzzkTokenRequest {
  grantType: "authorization_code" | "refresh_token";
  clientId: string;
  clientSecret: string;
  code?: string;
  refreshToken?: string;
  state?: string;
}

export interface ChzzkTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
  scope?: string;
}
