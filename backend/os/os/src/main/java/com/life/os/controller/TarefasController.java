package com.life.os.controller;

import com.life.os.dtos.TarefasDTO;
import com.life.os.dtos.UsuarioDTO;
import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import com.life.os.service.TarefasService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/v1/tarefas")
@RequiredArgsConstructor
public class TarefasController {
    private final TarefasService tarefaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<TarefasDTO> findAll(){
        return tarefaService.findAll();
    }

    @PostMapping

    @ResponseStatus(HttpStatus.CREATED)
    public void salvar(@Valid @RequestBody TarefasDTO tarefa){
        tarefaService.cadastrarTarefa(tarefa);
    }

    @GetMapping
    @RequestMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TarefasDTO buscarPorId(@PathVariable Long id){
        return tarefaService.buscarPorId(id);
    }

    @DeleteMapping
    @RequestMapping("/remover/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id){
        tarefaService.deleteTarefa(id);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void atualizar(@RequestBody TarefasDTO tarefa){
        tarefaService.atualizarTarefa(tarefa);
    }
}
