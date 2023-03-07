import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'restaurant',
        data: { pageTitle: 'dmGenieLogicielApp.restaurant.home.title' },
        loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule),
      },
      {
        path: 'client',
        data: { pageTitle: 'dmGenieLogicielApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'coursier',
        data: { pageTitle: 'dmGenieLogicielApp.coursier.home.title' },
        loadChildren: () => import('./coursier/coursier.module').then(m => m.CoursierModule),
      },
      {
        path: 'commande',
        data: { pageTitle: 'dmGenieLogicielApp.commande.home.title' },
        loadChildren: () => import('./commande/commande.module').then(m => m.CommandeModule),
      },
      {
        path: 'produit',
        data: { pageTitle: 'dmGenieLogicielApp.produit.home.title' },
        loadChildren: () => import('./produit/produit.module').then(m => m.ProduitModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
