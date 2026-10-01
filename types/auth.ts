export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Resposta de POST /auth/login. Nunca contém passwordHash. */
export interface LoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  /** Ex.: "1d". */
  expiresIn: string;
  /** ISO 8601: quando o token expira (usado na expiração do cookie). */
  expiresAt: string;
  user: AuthUser;
}
