package online.ft51land.modooseoul.domain.test.repository;

import online.ft51land.modooseoul.domain.test.entitiy.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<Test,Long> {
}
