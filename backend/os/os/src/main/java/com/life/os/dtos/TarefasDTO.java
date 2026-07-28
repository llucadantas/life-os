package com.life.os.dtos;

import com.life.os.model.TarefaModel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
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
    @NotBlank
    private String titulo;
    private String descricao;
    @NotNull
    private LocalDate vencimento;
    @NotNull
    private TarefaModel usuario;
}
