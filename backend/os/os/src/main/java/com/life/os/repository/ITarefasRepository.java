package com.life.os.repository;

import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ITarefasRepository extends JpaRepository<TarefasModel, Long> {
    List<TarefasModel> findAllByUsuario(Optional<UsuarioModel> byId);
}
