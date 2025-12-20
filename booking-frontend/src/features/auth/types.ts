export type Credentials = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type Session = {
  token: string;
  user: User;
};


