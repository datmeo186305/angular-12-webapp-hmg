export interface Auth {
  token?: string;
  authorities?: Array<string>;
  customerId?: string;
  exp?: number;
}

// export interface Auth {
//   accessToken?: string;
//   passwordHash?: string;
//   customerId?: string;
//   customerMobile?: string;
// }
