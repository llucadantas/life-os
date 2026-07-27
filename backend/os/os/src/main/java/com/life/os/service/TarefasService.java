package com.life.os.service;

import com.life.os.dtos.TarefasDTO;
import com.life.os.dtos.UsuarioDTO;
import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import com.life.os.repository.ITarefasRepository;
import com.life.os.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarefasService {
    private final IUsuarioRepository usuarios;
    private final ITarefasRepository tarefas;

    public List<UsuarioModel> findAll(){
        return usuarios.findAll();
    }

    public void cadastrarTarefa(TarefasDTO tarefa){
        UsuarioModel usuario = usuarios.findById(tarefa.getUsuario().getId())
                .orElseThrow(()-> new RuntimeException("Usuario não existe"));

        tarefas.save(TarefasModel.builder()
                .titulo(tarefa.getTitulo())
                .descricao(tarefa.getDescricao())
                .vencimento(tarefa.getVencimento())
                .usuario(usuario).build());
    }
}
