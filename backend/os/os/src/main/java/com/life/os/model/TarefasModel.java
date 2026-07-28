package com.life.os.model;

import com.life.os.dtos.TarefasDTO;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.BeanUtils;

import java.time.LocalDate;

@Entity
@Table(name = "tarefas")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TarefasModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false)
    private String titulo;
    private String descricao;
    @Column(nullable = false)
    private LocalDate vencimento;
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private UsuarioModel usuario;

    public TarefasModel(TarefasDTO tarefasDTO, UsuarioModel usuario) {
        BeanUtils.copyProperties(tarefasDTO, this);
        this.usuario = usuario;
    }

}
