package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Commande;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class CommandeRepositoryWithBagRelationshipsImpl implements CommandeRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Commande> fetchBagRelationships(Optional<Commande> commande) {
        return commande.map(this::fetchProduits);
    }

    @Override
    public Page<Commande> fetchBagRelationships(Page<Commande> commandes) {
        return new PageImpl<>(fetchBagRelationships(commandes.getContent()), commandes.getPageable(), commandes.getTotalElements());
    }

    @Override
    public List<Commande> fetchBagRelationships(List<Commande> commandes) {
        return Optional.of(commandes).map(this::fetchProduits).orElse(Collections.emptyList());
    }

    Commande fetchProduits(Commande result) {
        return entityManager
            .createQuery(
                "select commande from Commande commande left join fetch commande.produits where commande is :commande",
                Commande.class
            )
            .setParameter("commande", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Commande> fetchProduits(List<Commande> commandes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, commandes.size()).forEach(index -> order.put(commandes.get(index).getId(), index));
        List<Commande> result = entityManager
            .createQuery(
                "select distinct commande from Commande commande left join fetch commande.produits where commande in :commandes",
                Commande.class
            )
            .setParameter("commandes", commandes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
