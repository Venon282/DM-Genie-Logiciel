package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CoursierTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Coursier.class);
        Coursier coursier1 = new Coursier();
        coursier1.setId(1L);
        Coursier coursier2 = new Coursier();
        coursier2.setId(coursier1.getId());
        assertThat(coursier1).isEqualTo(coursier2);
        coursier2.setId(2L);
        assertThat(coursier1).isNotEqualTo(coursier2);
        coursier1.setId(null);
        assertThat(coursier1).isNotEqualTo(coursier2);
    }
}
