export interface Token {
  authorities?: Array<string>;
  sub?: string;
  iss?: string;
  exp?: number;
  iat?: number;
}
