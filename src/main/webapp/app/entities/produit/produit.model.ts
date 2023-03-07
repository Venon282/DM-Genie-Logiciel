import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { ICommande } from 'app/entities/commande/commande.model';

export interface IProduit {
  id: number;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  photo?: string | null;
  photoContentType?: string | null;
  restaurant?: Pick<IRestaurant, 'id'> | null;
  commandes?: Pick<ICommande, 'id'>[] | null;
}

export type NewProduit = Omit<IProduit, 'id'> & { id: null };
