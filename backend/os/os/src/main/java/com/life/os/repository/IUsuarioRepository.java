package com.life.os.repository;

import com.life.os.model.TarefaModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUsuarioRepository extends JpaRepository<TarefaModel, Long> {

}
