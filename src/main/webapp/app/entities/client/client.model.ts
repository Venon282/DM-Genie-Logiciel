export interface IClient {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  activated?: boolean | null;
}

export type NewClient = Omit<IClient, 'id'> & { id: null };
