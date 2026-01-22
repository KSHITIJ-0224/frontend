export type User = {
  id: string;
  name: string;
  email: string;
};

export type Task = {
  id: number;
  title: string;
  status: string;
  userId: number;
};
