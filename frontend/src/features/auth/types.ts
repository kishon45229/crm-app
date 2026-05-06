export type LoginValues = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

export type RefreshResponse = {
  accessToken: string;
};

export type SignupValues = {
  username: string;
  email: string;
  password: string;
};
