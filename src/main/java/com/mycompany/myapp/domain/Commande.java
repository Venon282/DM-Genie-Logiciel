package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Commande.
 */
@Entity
@Table(name = "commande")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Commande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 2, max = 100)
    @Column(name = "delivery_address", length = 100, nullable = false)
    private String deliveryAddress;

    @NotNull
    @Column(name = "delivery_latitude", nullable = false)
    private Float deliveryLatitude;

    @NotNull
    @Column(name = "delivery_longitude", nullable = false)
    private Float deliveryLongitude;

    @NotNull
    @Column(name = "delivery_distance", nullable = false)
    private Float deliveryDistance;

    @NotNull
    @Column(name = "delivery_fees", nullable = false)
    private Float deliveryFees;

    @NotNull
    @Column(name = "status", nullable = false)
    private String status;

    @JsonIgnoreProperties(value = { "commandes" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Coursier coursier;

    @ManyToOne
    @JsonIgnoreProperties(value = { "commandes" }, allowSetters = true)
    private Client client;

    @ManyToOne
    @JsonIgnoreProperties(value = { "produits", "commandes" }, allowSetters = true)
    private Restaurant restaurant;

    @ManyToMany
    @JoinTable(
        name = "rel_commande__produits",
        joinColumns = @JoinColumn(name = "commande_id"),
        inverseJoinColumns = @JoinColumn(name = "produits_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "restaurant", "commandes" }, allowSetters = true)
    private Set<Produit> produits = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Commande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public Commande deliveryAddress(String deliveryAddress) {
        this.setDeliveryAddress(deliveryAddress);
        return this;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public Float getDeliveryLatitude() {
        return this.deliveryLatitude;
    }

    public Commande deliveryLatitude(Float deliveryLatitude) {
        this.setDeliveryLatitude(deliveryLatitude);
        return this;
    }

    public void setDeliveryLatitude(Float deliveryLatitude) {
        this.deliveryLatitude = deliveryLatitude;
    }

    public Float getDeliveryLongitude() {
        return this.deliveryLongitude;
    }

    public Commande deliveryLongitude(Float deliveryLongitude) {
        this.setDeliveryLongitude(deliveryLongitude);
        return this;
    }

    public void setDeliveryLongitude(Float deliveryLongitude) {
        this.deliveryLongitude = deliveryLongitude;
    }

    public Float getDeliveryDistance() {
        return this.deliveryDistance;
    }

    public Commande deliveryDistance(Float deliveryDistance) {
        this.setDeliveryDistance(deliveryDistance);
        return this;
    }

    public void setDeliveryDistance(Float deliveryDistance) {
        this.deliveryDistance = deliveryDistance;
    }

    public Float getDeliveryFees() {
        return this.deliveryFees;
    }

    public Commande deliveryFees(Float deliveryFees) {
        this.setDeliveryFees(deliveryFees);
        return this;
    }

    public void setDeliveryFees(Float deliveryFees) {
        this.deliveryFees = deliveryFees;
    }

    public String getStatus() {
        return this.status;
    }

    public Commande status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Coursier getCoursier() {
        return this.coursier;
    }

    public void setCoursier(Coursier coursier) {
        this.coursier = coursier;
    }

    public Commande coursier(Coursier coursier) {
        this.setCoursier(coursier);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Commande client(Client client) {
        this.setClient(client);
        return this;
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Commande restaurant(Restaurant restaurant) {
        this.setRestaurant(restaurant);
        return this;
    }

    public Set<Produit> getProduits() {
        return this.produits;
    }

    public void setProduits(Set<Produit> produits) {
        this.produits = produits;
    }

    public Commande produits(Set<Produit> produits) {
        this.setProduits(produits);
        return this;
    }

    public Commande addProduits(Produit produit) {
        this.produits.add(produit);
        produit.getCommandes().add(this);
        return this;
    }

    public Commande removeProduits(Produit produit) {
        this.produits.remove(produit);
        produit.getCommandes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Commande)) {
            return false;
        }
        return id != null && id.equals(((Commande) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Commande{" +
            "id=" + getId() +
            ", deliveryAddress='" + getDeliveryAddress() + "'" +
            ", deliveryLatitude=" + getDeliveryLatitude() +
            ", deliveryLongitude=" + getDeliveryLongitude() +
            ", deliveryDistance=" + getDeliveryDistance() +
            ", deliveryFees=" + getDeliveryFees() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
