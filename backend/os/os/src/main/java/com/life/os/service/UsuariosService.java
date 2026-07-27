package com.life.os.service;

import com.life.os.dtos.UsuarioDTO;
import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import com.life.os.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuariosService {
    private final IUsuarioRepository usuarios;

    public List<UsuarioModel> findAll(){
        return usuarios.findAll();
    }

    public void cadastroUsuario(UsuarioDTO usuario){
        usuarios.save(UsuarioModel.builder()
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .build());
    }

}
