package com.life.os.controller;

import com.life.os.dtos.UsuarioDTO;
import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import com.life.os.service.UsuariosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/usuarios")
@RequiredArgsConstructor
public class UsuariosController {
    private final UsuariosService usuariosService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UsuarioModel> findAll(){
        return usuariosService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void salvar(@Valid @RequestBody UsuarioDTO usuario){
        usuariosService.cadastroUsuario(usuario);
    }
}
