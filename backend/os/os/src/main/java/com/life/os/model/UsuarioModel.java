package com.life.os.model;

import com.life.os.dtos.UsuarioDTO;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.BeanUtils;

import java.util.Set;

@Entity
@Table(name = "usuarios")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UsuarioModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nome;
    @Column(unique = true)
    private String email;
    @OneToMany(mappedBy = "usuario")
    private Set<TarefasModel> tarefas;

    public UsuarioModel(UsuarioDTO usuarioDTO) {
        BeanUtils.copyProperties(usuarioDTO, this);
    }

}
