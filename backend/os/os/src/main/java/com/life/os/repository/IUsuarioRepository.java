package com.life.os.repository;

import com.life.os.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IUsuarioRepository extends JpaRepository<UsuarioModel, Long> {

}
