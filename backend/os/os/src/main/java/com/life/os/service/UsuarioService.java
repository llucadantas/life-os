package com.life.os.service;

import com.life.os.dtos.TarefasDTO;
import com.life.os.dtos.UsuarioDTO;
import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import com.life.os.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final IUsuarioRepository usuarios;

        public Set<UsuarioDTO> findAll(){
            Set<UsuarioDTO> set = new HashSet<>();
            List<UsuarioModel> usuarioModel = usuarios.findAll();;
            for(UsuarioModel usuarioModel1 : usuarioModel){
                set.add(new UsuarioDTO(usuarioModel1));
            }
            return set;
    }

    public void cadastroUsuario(UsuarioDTO usuario){
        usuarios.save(UsuarioModel.builder()
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .build());
    }

    public void deleteUsuario(Long id){
        usuarios.deleteById(id);
    }

    public UsuarioDTO buscarPorId(Long id){
        UsuarioModel u = usuarios.findById(id).orElseThrow(()->new RuntimeException("a"));
        return new UsuarioDTO(u);
    }


    public Set<TarefasDTO> tarefasPorUsuario(Long id){
            Set<TarefasDTO> set = new HashSet<>();
            UsuarioModel usuarioModel = usuarios.findById(id).orElseThrow(()->new RuntimeException("a"));
            for(TarefasModel tarefasModel : usuarioModel.getTarefas()){
                set.add(new TarefasDTO(tarefasModel));
            }
            return set;
    }

}
