package com.life.os.controller;

import com.life.os.dtos.TarefasDTO;
import com.life.os.dtos.UsuarioDTO;
import com.life.os.model.UsuarioModel;
import com.life.os.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/v1/usuarios")
@RequiredArgsConstructor
public class UsuariosController {
    private final UsuarioService usuarioService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Set<UsuarioDTO> findAll(){
        return usuarioService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void salvar(@Valid @RequestBody UsuarioDTO usuario){
        usuarioService.cadastroUsuario(usuario);
    }

    @GetMapping
    @RequestMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioDTO buscarPorId(@PathVariable Long id){
        return usuarioService.buscarPorId(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id){
        usuarioService.deleteUsuario(id);
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping("/tarefas/{id}")
    public Set<TarefasDTO> buscarTodos(@PathVariable Long id){
        return usuarioService.tarefasPorUsuario(id);
    }
}
