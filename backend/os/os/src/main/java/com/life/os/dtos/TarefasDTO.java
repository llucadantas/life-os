package com.life.os.dtos;

import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.beans.BeanUtils;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Validated
public class TarefasDTO {
    private Long id;
    @NotBlank
    private String titulo;
    private String descricao;
    @NotNull
    private LocalDate vencimento;
    @NotNull
    private Long usuario;

    public TarefasDTO(TarefasModel tarefasModel) {
        BeanUtils.copyProperties(tarefasModel, this);
        this.usuario = tarefasModel.getUsuario().getId();
    }
}
