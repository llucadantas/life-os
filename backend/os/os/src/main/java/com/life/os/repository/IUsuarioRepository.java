package com.life.os.repository;

import com.life.os.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUsuarioRepository extends JpaRepository<UsuarioModel, Long> {

}
