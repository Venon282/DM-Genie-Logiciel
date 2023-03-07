package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Commande;
import com.mycompany.myapp.repository.CommandeRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CommandeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CommandeResourceIT {

    private static final String DEFAULT_DELIVERY_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_DELIVERY_ADDRESS = "BBBBBBBBBB";

    private static final Float DEFAULT_DELIVERY_LATITUDE = 1F;
    private static final Float UPDATED_DELIVERY_LATITUDE = 2F;

    private static final Float DEFAULT_DELIVERY_LONGITUDE = 1F;
    private static final Float UPDATED_DELIVERY_LONGITUDE = 2F;

    private static final Float DEFAULT_DELIVERY_DISTANCE = 1F;
    private static final Float UPDATED_DELIVERY_DISTANCE = 2F;

    private static final Float DEFAULT_DELIVERY_FEES = 1F;
    private static final Float UPDATED_DELIVERY_FEES = 2F;

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/commandes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommandeRepository commandeRepository;

    @Mock
    private CommandeRepository commandeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommandeMockMvc;

    private Commande commande;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commande createEntity(EntityManager em) {
        Commande commande = new Commande()
            .deliveryAddress(DEFAULT_DELIVERY_ADDRESS)
            .deliveryLatitude(DEFAULT_DELIVERY_LATITUDE)
            .deliveryLongitude(DEFAULT_DELIVERY_LONGITUDE)
            .deliveryDistance(DEFAULT_DELIVERY_DISTANCE)
            .deliveryFees(DEFAULT_DELIVERY_FEES)
            .status(DEFAULT_STATUS);
        return commande;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commande createUpdatedEntity(EntityManager em) {
        Commande commande = new Commande()
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .deliveryLatitude(UPDATED_DELIVERY_LATITUDE)
            .deliveryLongitude(UPDATED_DELIVERY_LONGITUDE)
            .deliveryDistance(UPDATED_DELIVERY_DISTANCE)
            .deliveryFees(UPDATED_DELIVERY_FEES)
            .status(UPDATED_STATUS);
        return commande;
    }

    @BeforeEach
    public void initTest() {
        commande = createEntity(em);
    }

    @Test
    @Transactional
    void createCommande() throws Exception {
        int databaseSizeBeforeCreate = commandeRepository.findAll().size();
        // Create the Commande
        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isCreated());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeCreate + 1);
        Commande testCommande = commandeList.get(commandeList.size() - 1);
        assertThat(testCommande.getDeliveryAddress()).isEqualTo(DEFAULT_DELIVERY_ADDRESS);
        assertThat(testCommande.getDeliveryLatitude()).isEqualTo(DEFAULT_DELIVERY_LATITUDE);
        assertThat(testCommande.getDeliveryLongitude()).isEqualTo(DEFAULT_DELIVERY_LONGITUDE);
        assertThat(testCommande.getDeliveryDistance()).isEqualTo(DEFAULT_DELIVERY_DISTANCE);
        assertThat(testCommande.getDeliveryFees()).isEqualTo(DEFAULT_DELIVERY_FEES);
        assertThat(testCommande.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createCommandeWithExistingId() throws Exception {
        // Create the Commande with an existing ID
        commande.setId(1L);

        int databaseSizeBeforeCreate = commandeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isBadRequest());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDeliveryAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = commandeRepository.findAll().size();
        // set the field null
        commande.setDeliveryAddress(null);

        // Create the Commande, which fails.

        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isBadRequest());

        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDeliveryLatitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = commandeRepository.findAll().size();
        // set the field null
        commande.setDeliveryLatitude(null);

        // Create the Commande, which fails.

        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isBadRequest());

        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDeliveryLongitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = commandeRepository.findAll().size();
        // set the field null
        commande.setDeliveryLongitude(null);

        // Create the Commande, which fails.

        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isBadRequest());

        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDeliveryDistanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = commandeRepository.findAll().size();
        // set the field null
        commande.setDeliveryDistance(null);

        // Create the Commande, which fails.

        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isBadRequest());

        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDeliveryFeesIsRequired() throws Exception {
        int databaseSizeBeforeTest = commandeRepository.findAll().size();
        // set the field null
        commande.setDeliveryFees(null);

        // Create the Commande, which fails.

        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isBadRequest());

        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = commandeRepository.findAll().size();
        // set the field null
        commande.setStatus(null);

        // Create the Commande, which fails.

        restCommandeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isBadRequest());

        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCommandes() throws Exception {
        // Initialize the database
        commandeRepository.saveAndFlush(commande);

        // Get all the commandeList
        restCommandeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commande.getId().intValue())))
            .andExpect(jsonPath("$.[*].deliveryAddress").value(hasItem(DEFAULT_DELIVERY_ADDRESS)))
            .andExpect(jsonPath("$.[*].deliveryLatitude").value(hasItem(DEFAULT_DELIVERY_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].deliveryLongitude").value(hasItem(DEFAULT_DELIVERY_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].deliveryDistance").value(hasItem(DEFAULT_DELIVERY_DISTANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].deliveryFees").value(hasItem(DEFAULT_DELIVERY_FEES.doubleValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCommandesWithEagerRelationshipsIsEnabled() throws Exception {
        when(commandeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCommandeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(commandeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCommandesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(commandeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCommandeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(commandeRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCommande() throws Exception {
        // Initialize the database
        commandeRepository.saveAndFlush(commande);

        // Get the commande
        restCommandeMockMvc
            .perform(get(ENTITY_API_URL_ID, commande.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(commande.getId().intValue()))
            .andExpect(jsonPath("$.deliveryAddress").value(DEFAULT_DELIVERY_ADDRESS))
            .andExpect(jsonPath("$.deliveryLatitude").value(DEFAULT_DELIVERY_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.deliveryLongitude").value(DEFAULT_DELIVERY_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.deliveryDistance").value(DEFAULT_DELIVERY_DISTANCE.doubleValue()))
            .andExpect(jsonPath("$.deliveryFees").value(DEFAULT_DELIVERY_FEES.doubleValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingCommande() throws Exception {
        // Get the commande
        restCommandeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCommande() throws Exception {
        // Initialize the database
        commandeRepository.saveAndFlush(commande);

        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();

        // Update the commande
        Commande updatedCommande = commandeRepository.findById(commande.getId()).get();
        // Disconnect from session so that the updates on updatedCommande are not directly saved in db
        em.detach(updatedCommande);
        updatedCommande
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .deliveryLatitude(UPDATED_DELIVERY_LATITUDE)
            .deliveryLongitude(UPDATED_DELIVERY_LONGITUDE)
            .deliveryDistance(UPDATED_DELIVERY_DISTANCE)
            .deliveryFees(UPDATED_DELIVERY_FEES)
            .status(UPDATED_STATUS);

        restCommandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCommande.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCommande))
            )
            .andExpect(status().isOk());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
        Commande testCommande = commandeList.get(commandeList.size() - 1);
        assertThat(testCommande.getDeliveryAddress()).isEqualTo(UPDATED_DELIVERY_ADDRESS);
        assertThat(testCommande.getDeliveryLatitude()).isEqualTo(UPDATED_DELIVERY_LATITUDE);
        assertThat(testCommande.getDeliveryLongitude()).isEqualTo(UPDATED_DELIVERY_LONGITUDE);
        assertThat(testCommande.getDeliveryDistance()).isEqualTo(UPDATED_DELIVERY_DISTANCE);
        assertThat(testCommande.getDeliveryFees()).isEqualTo(UPDATED_DELIVERY_FEES);
        assertThat(testCommande.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingCommande() throws Exception {
        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();
        commande.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, commande.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commande))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommande() throws Exception {
        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();
        commande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commande))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommande() throws Exception {
        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();
        commande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommandeWithPatch() throws Exception {
        // Initialize the database
        commandeRepository.saveAndFlush(commande);

        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();

        // Update the commande using partial update
        Commande partialUpdatedCommande = new Commande();
        partialUpdatedCommande.setId(commande.getId());

        partialUpdatedCommande
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .deliveryDistance(UPDATED_DELIVERY_DISTANCE)
            .deliveryFees(UPDATED_DELIVERY_FEES);

        restCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommande))
            )
            .andExpect(status().isOk());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
        Commande testCommande = commandeList.get(commandeList.size() - 1);
        assertThat(testCommande.getDeliveryAddress()).isEqualTo(UPDATED_DELIVERY_ADDRESS);
        assertThat(testCommande.getDeliveryLatitude()).isEqualTo(DEFAULT_DELIVERY_LATITUDE);
        assertThat(testCommande.getDeliveryLongitude()).isEqualTo(DEFAULT_DELIVERY_LONGITUDE);
        assertThat(testCommande.getDeliveryDistance()).isEqualTo(UPDATED_DELIVERY_DISTANCE);
        assertThat(testCommande.getDeliveryFees()).isEqualTo(UPDATED_DELIVERY_FEES);
        assertThat(testCommande.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateCommandeWithPatch() throws Exception {
        // Initialize the database
        commandeRepository.saveAndFlush(commande);

        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();

        // Update the commande using partial update
        Commande partialUpdatedCommande = new Commande();
        partialUpdatedCommande.setId(commande.getId());

        partialUpdatedCommande
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .deliveryLatitude(UPDATED_DELIVERY_LATITUDE)
            .deliveryLongitude(UPDATED_DELIVERY_LONGITUDE)
            .deliveryDistance(UPDATED_DELIVERY_DISTANCE)
            .deliveryFees(UPDATED_DELIVERY_FEES)
            .status(UPDATED_STATUS);

        restCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommande))
            )
            .andExpect(status().isOk());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
        Commande testCommande = commandeList.get(commandeList.size() - 1);
        assertThat(testCommande.getDeliveryAddress()).isEqualTo(UPDATED_DELIVERY_ADDRESS);
        assertThat(testCommande.getDeliveryLatitude()).isEqualTo(UPDATED_DELIVERY_LATITUDE);
        assertThat(testCommande.getDeliveryLongitude()).isEqualTo(UPDATED_DELIVERY_LONGITUDE);
        assertThat(testCommande.getDeliveryDistance()).isEqualTo(UPDATED_DELIVERY_DISTANCE);
        assertThat(testCommande.getDeliveryFees()).isEqualTo(UPDATED_DELIVERY_FEES);
        assertThat(testCommande.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingCommande() throws Exception {
        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();
        commande.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, commande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commande))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommande() throws Exception {
        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();
        commande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commande))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommande() throws Exception {
        int databaseSizeBeforeUpdate = commandeRepository.findAll().size();
        commande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(commande)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Commande in the database
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommande() throws Exception {
        // Initialize the database
        commandeRepository.saveAndFlush(commande);

        int databaseSizeBeforeDelete = commandeRepository.findAll().size();

        // Delete the commande
        restCommandeMockMvc
            .perform(delete(ENTITY_API_URL_ID, commande.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Commande> commandeList = commandeRepository.findAll();
        assertThat(commandeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
