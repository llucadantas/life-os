package com.life.os.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "habitos")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class HabitosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String titulo;
    private String descricao;
    @Column(name = "meta_semanal",  nullable = false)
    private Integer metaSemanal;
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private TarefaModel usuario;
}
