package com.life.os.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Validated
public class UsuarioDTO {

    @NotBlank
    private String nome;
    @NotBlank
    private String email;
}
