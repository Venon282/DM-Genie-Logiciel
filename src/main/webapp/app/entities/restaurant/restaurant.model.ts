import { Language } from 'app/entities/enumerations/language.model';

export interface IRestaurant {
  id: number;
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  language?: Language | null;
  activated?: boolean | null;
}

export type NewRestaurant = Omit<IRestaurant, 'id'> & { id: null };
