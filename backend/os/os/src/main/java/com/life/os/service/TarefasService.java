package com.life.os.service;

import com.life.os.dtos.TarefasDTO;
import com.life.os.model.TarefasModel;
import com.life.os.model.TarefaModel;
import com.life.os.repository.ITarefasRepository;
import com.life.os.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TarefasService {
    private final IUsuarioRepository usuarios;
    private final ITarefasRepository tarefas;

    public List<TarefaModel> findAll(){
        return usuarios.findAll();
    }

    public void cadastrarTarefa(TarefasDTO tarefa){
        TarefaModel usuario = usuarios.findById(tarefa.getUsuario().getId())
                .orElseThrow(()-> new RuntimeException("Usuario não existe"));

        tarefas.save(TarefasModel.builder()
                .titulo(tarefa.getTitulo())
                .descricao(tarefa.getDescricao())
                .vencimento(tarefa.getVencimento())
                .usuario(usuario).build());
    }

    public void deleteTarefa(Long id){
        tarefas.deleteById(id);
    }

    public Optional<TarefasModel> buscarPorId(Long id){
        return tarefas.findById(id);
    }

    public void atualizarTarefa(TarefasModel tarefa){
        if(buscarPorId(tarefa.getId()).isEmpty()){
            throw new RuntimeException("");
        }
        tarefas.save(tarefa);
    }
}
