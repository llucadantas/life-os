package com.life.os.repository;

import com.life.os.model.HabitosModel;
import com.life.os.model.TarefasModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IHabitosModel extends JpaRepository<HabitosModel, Long> {
}
