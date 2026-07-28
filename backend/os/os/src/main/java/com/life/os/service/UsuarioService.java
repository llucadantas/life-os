package com.life.os.service;

import com.life.os.dtos.UsuarioDTO;
import com.life.os.model.TarefaModel;
import com.life.os.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final IUsuarioRepository usuarios;

    public List<TarefaModel> findAll(){
        return usuarios.findAll();
    }

    public void cadastroUsuario(UsuarioDTO usuario){
        usuarios.save(TarefaModel.builder()
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .build());
    }

    public void deleteUsuario(Long id){
        usuarios.deleteById(id);
    }

    public Optional<TarefaModel> buscarPorId(Long id){
        return usuarios.findById(id);
    }

    public void atualizarUsuario(TarefaModel usuario){
        if(buscarPorId(usuario.getId()).isEmpty()){
            throw new RuntimeException("");
        }
        usuarios.save(usuario);
    }

}
