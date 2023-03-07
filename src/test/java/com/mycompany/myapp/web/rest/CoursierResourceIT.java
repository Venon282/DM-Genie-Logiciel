package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Coursier;
import com.mycompany.myapp.repository.CoursierRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CoursierResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CoursierResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "0";
    private static final String UPDATED_PHONE = "0B";

    private static final String DEFAULT_EMAIL = "-v_W@4r6WnRmwHp";
    private static final String UPDATED_EMAIL = "e.B@6Rw0rMui-ZbG";

    private static final String DEFAULT_VEHICLE_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_VEHICLE_TYPE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACTIVATED = false;
    private static final Boolean UPDATED_ACTIVATED = true;

    private static final String ENTITY_API_URL = "/api/coursiers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CoursierRepository coursierRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCoursierMockMvc;

    private Coursier coursier;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coursier createEntity(EntityManager em) {
        Coursier coursier = new Coursier()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .phone(DEFAULT_PHONE)
            .email(DEFAULT_EMAIL)
            .vehicleType(DEFAULT_VEHICLE_TYPE)
            .activated(DEFAULT_ACTIVATED);
        return coursier;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coursier createUpdatedEntity(EntityManager em) {
        Coursier coursier = new Coursier()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL)
            .vehicleType(UPDATED_VEHICLE_TYPE)
            .activated(UPDATED_ACTIVATED);
        return coursier;
    }

    @BeforeEach
    public void initTest() {
        coursier = createEntity(em);
    }

    @Test
    @Transactional
    void createCoursier() throws Exception {
        int databaseSizeBeforeCreate = coursierRepository.findAll().size();
        // Create the Coursier
        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isCreated());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeCreate + 1);
        Coursier testCoursier = coursierList.get(coursierList.size() - 1);
        assertThat(testCoursier.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testCoursier.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testCoursier.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testCoursier.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testCoursier.getVehicleType()).isEqualTo(DEFAULT_VEHICLE_TYPE);
        assertThat(testCoursier.getActivated()).isEqualTo(DEFAULT_ACTIVATED);
    }

    @Test
    @Transactional
    void createCoursierWithExistingId() throws Exception {
        // Create the Coursier with an existing ID
        coursier.setId(1L);

        int databaseSizeBeforeCreate = coursierRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isBadRequest());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursierRepository.findAll().size();
        // set the field null
        coursier.setFirstName(null);

        // Create the Coursier, which fails.

        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isBadRequest());

        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursierRepository.findAll().size();
        // set the field null
        coursier.setLastName(null);

        // Create the Coursier, which fails.

        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isBadRequest());

        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursierRepository.findAll().size();
        // set the field null
        coursier.setPhone(null);

        // Create the Coursier, which fails.

        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isBadRequest());

        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursierRepository.findAll().size();
        // set the field null
        coursier.setEmail(null);

        // Create the Coursier, which fails.

        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isBadRequest());

        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVehicleTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursierRepository.findAll().size();
        // set the field null
        coursier.setVehicleType(null);

        // Create the Coursier, which fails.

        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isBadRequest());

        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkActivatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursierRepository.findAll().size();
        // set the field null
        coursier.setActivated(null);

        // Create the Coursier, which fails.

        restCoursierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isBadRequest());

        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCoursiers() throws Exception {
        // Initialize the database
        coursierRepository.saveAndFlush(coursier);

        // Get all the coursierList
        restCoursierMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coursier.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].vehicleType").value(hasItem(DEFAULT_VEHICLE_TYPE)))
            .andExpect(jsonPath("$.[*].activated").value(hasItem(DEFAULT_ACTIVATED.booleanValue())));
    }

    @Test
    @Transactional
    void getCoursier() throws Exception {
        // Initialize the database
        coursierRepository.saveAndFlush(coursier);

        // Get the coursier
        restCoursierMockMvc
            .perform(get(ENTITY_API_URL_ID, coursier.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(coursier.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.vehicleType").value(DEFAULT_VEHICLE_TYPE))
            .andExpect(jsonPath("$.activated").value(DEFAULT_ACTIVATED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingCoursier() throws Exception {
        // Get the coursier
        restCoursierMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCoursier() throws Exception {
        // Initialize the database
        coursierRepository.saveAndFlush(coursier);

        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();

        // Update the coursier
        Coursier updatedCoursier = coursierRepository.findById(coursier.getId()).get();
        // Disconnect from session so that the updates on updatedCoursier are not directly saved in db
        em.detach(updatedCoursier);
        updatedCoursier
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL)
            .vehicleType(UPDATED_VEHICLE_TYPE)
            .activated(UPDATED_ACTIVATED);

        restCoursierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCoursier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCoursier))
            )
            .andExpect(status().isOk());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
        Coursier testCoursier = coursierList.get(coursierList.size() - 1);
        assertThat(testCoursier.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testCoursier.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testCoursier.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testCoursier.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testCoursier.getVehicleType()).isEqualTo(UPDATED_VEHICLE_TYPE);
        assertThat(testCoursier.getActivated()).isEqualTo(UPDATED_ACTIVATED);
    }

    @Test
    @Transactional
    void putNonExistingCoursier() throws Exception {
        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();
        coursier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, coursier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(coursier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCoursier() throws Exception {
        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();
        coursier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(coursier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCoursier() throws Exception {
        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();
        coursier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursierMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCoursierWithPatch() throws Exception {
        // Initialize the database
        coursierRepository.saveAndFlush(coursier);

        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();

        // Update the coursier using partial update
        Coursier partialUpdatedCoursier = new Coursier();
        partialUpdatedCoursier.setId(coursier.getId());

        partialUpdatedCoursier.firstName(UPDATED_FIRST_NAME).activated(UPDATED_ACTIVATED);

        restCoursierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoursier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCoursier))
            )
            .andExpect(status().isOk());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
        Coursier testCoursier = coursierList.get(coursierList.size() - 1);
        assertThat(testCoursier.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testCoursier.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testCoursier.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testCoursier.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testCoursier.getVehicleType()).isEqualTo(DEFAULT_VEHICLE_TYPE);
        assertThat(testCoursier.getActivated()).isEqualTo(UPDATED_ACTIVATED);
    }

    @Test
    @Transactional
    void fullUpdateCoursierWithPatch() throws Exception {
        // Initialize the database
        coursierRepository.saveAndFlush(coursier);

        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();

        // Update the coursier using partial update
        Coursier partialUpdatedCoursier = new Coursier();
        partialUpdatedCoursier.setId(coursier.getId());

        partialUpdatedCoursier
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL)
            .vehicleType(UPDATED_VEHICLE_TYPE)
            .activated(UPDATED_ACTIVATED);

        restCoursierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoursier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCoursier))
            )
            .andExpect(status().isOk());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
        Coursier testCoursier = coursierList.get(coursierList.size() - 1);
        assertThat(testCoursier.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testCoursier.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testCoursier.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testCoursier.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testCoursier.getVehicleType()).isEqualTo(UPDATED_VEHICLE_TYPE);
        assertThat(testCoursier.getActivated()).isEqualTo(UPDATED_ACTIVATED);
    }

    @Test
    @Transactional
    void patchNonExistingCoursier() throws Exception {
        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();
        coursier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, coursier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(coursier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCoursier() throws Exception {
        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();
        coursier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(coursier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCoursier() throws Exception {
        int databaseSizeBeforeUpdate = coursierRepository.findAll().size();
        coursier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursierMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(coursier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coursier in the database
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCoursier() throws Exception {
        // Initialize the database
        coursierRepository.saveAndFlush(coursier);

        int databaseSizeBeforeDelete = coursierRepository.findAll().size();

        // Delete the coursier
        restCoursierMockMvc
            .perform(delete(ENTITY_API_URL_ID, coursier.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Coursier> coursierList = coursierRepository.findAll();
        assertThat(coursierList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
