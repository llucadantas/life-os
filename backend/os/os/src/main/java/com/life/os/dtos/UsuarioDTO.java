package com.life.os.dtos;

import com.life.os.model.UsuarioModel;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Validated
public class UsuarioDTO {

    private Long id;
    @NotBlank
    private String nome;
    @NotBlank
    private String email;

    public UsuarioDTO(UsuarioModel usuario) {
        BeanUtils.copyProperties(usuario, this);
    }
}
