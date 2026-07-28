package com.life.os.service;

import com.life.os.dtos.TarefasDTO;
import com.life.os.model.TarefasModel;
import com.life.os.model.UsuarioModel;
import com.life.os.repository.ITarefasRepository;
import com.life.os.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TarefasService {
    private final IUsuarioRepository usuarios;
    private final ITarefasRepository tarefas;

    public Set<TarefasDTO> findAll(){
        Set<TarefasDTO> tarefasDTOS = new HashSet<>();
        for(TarefasModel tarefas : tarefas.findAll()){
            tarefasDTOS.add(new TarefasDTO(tarefas));
        }
        return tarefasDTOS;
    }

    public void cadastrarTarefa(TarefasDTO tarefa){
        UsuarioModel usuario = usuarios.findById(tarefa.getUsuario())
                .orElseThrow(()-> new RuntimeException("Usuario Nao Encontrado  "));
        TarefasModel t = new TarefasModel(tarefa, usuario);
        tarefas.save(t);
    }

    public void deleteTarefa(Long id){
        tarefas.deleteById(id);
    }

    public TarefasDTO buscarPorId(Long id){
        TarefasModel t = tarefas.findById(id).orElseThrow(()-> new RuntimeException("Tarefas NaoEncontrado  "));
        return new TarefasDTO(t);
    }

    public void atualizarTarefa(TarefasDTO tarefa){
        TarefasModel t = tarefas.findById(tarefa.getId()).orElseThrow(()-> new RuntimeException("Tarefas NaoEncontrado  "));
        t.setTitulo(tarefa.getTitulo());
        t.setDescricao(tarefa.getDescricao());
        t.setVencimento(tarefa.getVencimento());
        tarefas.save(t);
    }

}
