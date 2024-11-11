import React, { useState, useEffect } from 'react';
import { Input, Button, Upload, message, List, Card } from 'antd';
import { supabase } from "../../Supabase/createClient.js";  // Importando o cliente Supabase

function Criar() {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [autor, setAutor] = useState('');  // Novo estado para autor
    const [imagem, setImagem] = useState(null);
    const [receitas, setReceitas] = useState([]);  // Estado para armazenar as receitas do usuário logado

    const userEmail = localStorage.getItem('user_token');  // Obtém o e-mail do usuário logado

    // Função para lidar com a submissão da receita
    const handleSubmit = async () => {
        if (!titulo || !descricao || !imagem || !autor) {
            message.error("Todos os campos são obrigatórios!");  // Verifica se os campos foram preenchidos
            return;
        }

        try {
            // Carregar a imagem no Supabase Storage (caso o usuário envie uma imagem)
            const { data, error: uploadError } = await supabase
                .storage
                .from('receitas-images')  // Nome do bucket no Supabase
                .upload(`public/${imagem.name}`, imagem);

            if (uploadError) {
                message.error("Erro ao fazer upload da imagem!");
                return;
            }

            const imagemUrl = data?.path;  // Obtém o caminho da imagem carregada

            // Inserir a receita na tabela 'receitas' com o caminho da imagem e autor
            const { error } = await supabase
                .from('receitas')
                .insert([
                    {
                        titulo,
                        descricao,
                        autor,  // Adiciona o autor
                        imagem_url: imagemUrl,  // Salva o caminho da imagem no campo 'imagem_url'
                        curtidas: 0,
                        user_email: userEmail  // Relaciona a receita ao usuário logado
                    }
                ]);

            if (error) throw error;

            message.success("Receita criada com sucesso!");
            setTitulo('');
            setDescricao('');
            setAutor('');  // Limpa o campo autor após sucesso
            setImagem(null);  // Limpa o campo imagem após sucesso

            // Atualiza a lista de receitas após a criação
            fetchReceitas();
        } catch (err) {
            message.error("Erro ao criar a receita: " + err.message);
        }
    };

    // Função para buscar as receitas do usuário logado
    const fetchReceitas = async () => {
        const { data, error } = await supabase
            .from('receitas')
            .select('*')
            .eq('user_email', userEmail);  // Filtra receitas pelo e-mail do usuário logado

        if (error) {
            message.error("Erro ao carregar receitas: " + error.message);
            return;
        }

        setReceitas(data);  // Atualiza o estado com as receitas
    };

    // Função para excluir uma receita
    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('receitas')
            .delete()
            .eq('id', id);  // Deleta a receita com o id correspondente

        if (error) {
            message.error("Erro ao excluir a receita: " + error.message);
            return;
        }

        message.success("Receita excluída com sucesso!");
        fetchReceitas();  // Atualiza a lista de receitas após a exclusão
    };

    useEffect(() => {
        fetchReceitas();  // Chama a função para buscar as receitas ao carregar o componente
    }, []);

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
            <h2>Criar Receita</h2>
            <Input
                placeholder="Título da Receita"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}  // Atualiza o título da receita
                style={{ marginBottom: '10px' }}
            />
            <Input.TextArea
                placeholder="Descrição da Receita"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}  // Atualiza a descrição da receita
                style={{ marginBottom: '10px' }}
                rows={4}
            />
            <Input
                placeholder="Autor da Receita"  // Novo campo para o autor
                value={autor}
                onChange={(e) => setAutor(e.target.value)}  // Atualiza o autor da receita
                style={{ marginBottom: '10px' }}
            />
            <Upload
                beforeUpload={(file) => {
                    setImagem(file);  // Define a imagem selecionada
                    return false;  // Previne o upload automático do arquivo
                }}
                showUploadList={false}
            >
                <Button>Selecionar Imagem</Button>  {/* Botão para selecionar imagem */}
            </Upload>
            <div style={{ marginTop: '10px' }}>
                <Button onClick={handleSubmit} type="primary">
                    Criar Receita
                </Button>
            </div>

            <h2 style={{ marginTop: '30px' }}>Minhas Receitas</h2>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={receitas}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            title={item.titulo}
                            extra={<Button danger onClick={() => handleDelete(item.id)}>Excluir</Button>}
                        >
                            <p><strong>Autor:</strong> {item.autor}</p>
                            <p>{item.descricao}</p>
                            {/* <img src={`https://your-supabase-url/storage/v1/object/public/receitas-images/${item.imagem_url}`} alt={item.titulo} style={{ width: '100%' }} /> */}
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default Criar;
