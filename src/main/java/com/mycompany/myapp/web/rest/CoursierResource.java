package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Coursier;
import com.mycompany.myapp.repository.CoursierRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Coursier}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CoursierResource {

    private final Logger log = LoggerFactory.getLogger(CoursierResource.class);

    private static final String ENTITY_NAME = "coursier";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CoursierRepository coursierRepository;

    public CoursierResource(CoursierRepository coursierRepository) {
        this.coursierRepository = coursierRepository;
    }

    /**
     * {@code POST  /coursiers} : Create a new coursier.
     *
     * @param coursier the coursier to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new coursier, or with status {@code 400 (Bad Request)} if the coursier has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/coursiers")
    public ResponseEntity<Coursier> createCoursier(@Valid @RequestBody Coursier coursier) throws URISyntaxException {
        log.debug("REST request to save Coursier : {}", coursier);
        if (coursier.getId() != null) {
            throw new BadRequestAlertException("A new coursier cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Coursier result = coursierRepository.save(coursier);
        return ResponseEntity
            .created(new URI("/api/coursiers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /coursiers/:id} : Updates an existing coursier.
     *
     * @param id the id of the coursier to save.
     * @param coursier the coursier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated coursier,
     * or with status {@code 400 (Bad Request)} if the coursier is not valid,
     * or with status {@code 500 (Internal Server Error)} if the coursier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/coursiers/{id}")
    public ResponseEntity<Coursier> updateCoursier(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Coursier coursier
    ) throws URISyntaxException {
        log.debug("REST request to update Coursier : {}, {}", id, coursier);
        if (coursier.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, coursier.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coursierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Coursier result = coursierRepository.save(coursier);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, coursier.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /coursiers/:id} : Partial updates given fields of an existing coursier, field will ignore if it is null
     *
     * @param id the id of the coursier to save.
     * @param coursier the coursier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated coursier,
     * or with status {@code 400 (Bad Request)} if the coursier is not valid,
     * or with status {@code 404 (Not Found)} if the coursier is not found,
     * or with status {@code 500 (Internal Server Error)} if the coursier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/coursiers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Coursier> partialUpdateCoursier(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Coursier coursier
    ) throws URISyntaxException {
        log.debug("REST request to partial update Coursier partially : {}, {}", id, coursier);
        if (coursier.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, coursier.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coursierRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Coursier> result = coursierRepository
            .findById(coursier.getId())
            .map(existingCoursier -> {
                if (coursier.getFirstName() != null) {
                    existingCoursier.setFirstName(coursier.getFirstName());
                }
                if (coursier.getLastName() != null) {
                    existingCoursier.setLastName(coursier.getLastName());
                }
                if (coursier.getPhone() != null) {
                    existingCoursier.setPhone(coursier.getPhone());
                }
                if (coursier.getEmail() != null) {
                    existingCoursier.setEmail(coursier.getEmail());
                }
                if (coursier.getVehicleType() != null) {
                    existingCoursier.setVehicleType(coursier.getVehicleType());
                }
                if (coursier.getActivated() != null) {
                    existingCoursier.setActivated(coursier.getActivated());
                }

                return existingCoursier;
            })
            .map(coursierRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, coursier.getId().toString())
        );
    }

    /**
     * {@code GET  /coursiers} : get all the coursiers.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of coursiers in body.
     */
    @GetMapping("/coursiers")
    public List<Coursier> getAllCoursiers(@RequestParam(required = false) String filter) {
        if ("commandes-is-null".equals(filter)) {
            log.debug("REST request to get all Coursiers where commandes is null");
            return StreamSupport
                .stream(coursierRepository.findAll().spliterator(), false)
                .filter(coursier -> coursier.getCommandes() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Coursiers");
        return coursierRepository.findAll();
    }

    /**
     * {@code GET  /coursiers/:id} : get the "id" coursier.
     *
     * @param id the id of the coursier to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the coursier, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/coursiers/{id}")
    public ResponseEntity<Coursier> getCoursier(@PathVariable Long id) {
        log.debug("REST request to get Coursier : {}", id);
        Optional<Coursier> coursier = coursierRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(coursier);
    }

    /**
     * {@code DELETE  /coursiers/:id} : delete the "id" coursier.
     *
     * @param id the id of the coursier to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/coursiers/{id}")
    public ResponseEntity<Void> deleteCoursier(@PathVariable Long id) {
        log.debug("REST request to delete Coursier : {}", id);
        coursierRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
