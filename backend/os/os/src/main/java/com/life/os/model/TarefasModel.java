package com.life.os.model;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.util.UUID;

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

}
