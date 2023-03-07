import { ICoursier } from 'app/entities/coursier/coursier.model';
import { IClient } from 'app/entities/client/client.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { IProduit } from 'app/entities/produit/produit.model';

export interface ICommande {
  id: number;
  deliveryAddress?: string | null;
  deliveryLatitude?: number | null;
  deliveryLongitude?: number | null;
  deliveryDistance?: number | null;
  deliveryFees?: number | null;
  status?: string | null;
  coursier?: Pick<ICoursier, 'id'> | null;
  client?: Pick<IClient, 'id'> | null;
  restaurant?: Pick<IRestaurant, 'id'> | null;
  produits?: Pick<IProduit, 'id'>[] | null;
}

export type NewCommande = Omit<ICommande, 'id'> & { id: null };
