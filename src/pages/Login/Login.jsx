import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { supabase } from "../../Supabase/createClient.js";
import { useNavigate } from 'react-router-dom';  // Importe o useNavigate

function FazerLogin() {
    // Estado para armazenar o email e senha inseridos pelo usuário
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    // Criação da função navigate
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica se o usuário já está logado
        const userToken = localStorage.getItem('user_token');
        if (userToken) {
            // Caso o token esteja presente, redireciona para /receitas
            navigate('/receitas');
        }
    }, [navigate]);  // Esse efeito será executado apenas uma vez após o componente ser montado

    // Função para lidar com o envio do formulário de login
    const handleLogin = async () => {
        if (!email || !senha) {
            message.error('Por favor, preencha ambos os campos!');
            return;
        }

        setLoading(true);

        try {
            // Verificando se o email e senha existem no banco de dados
            const { data, error } = await supabase
                .from('usuarios_receita')
                .select('*')
                .eq('email', email)
                .eq('senha', senha)
                .single();  // Assume que queremos apenas um usuário

            if (error) {
                throw error;
            }

            if (data) {
                // Exibe mensagem de sucesso
                message.success('Login bem-sucedido!');

                // Salva o e-mail do usuário logado no localStorage como um token
                localStorage.setItem('user_token', email);  // Você pode armazenar o 'id' ou qualquer outro dado único

                // Redireciona para a página /receitas
                navigate('/receitas');  // Navega para /receitas
            } else {
                // Exibe mensagem de erro caso o usuário não exista
                message.error('E-mail ou senha incorretos!');
            }
        } catch (error) {
            message.error(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <h2>Login</h2>
            <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: 10 }}
            />
            <Input.Password
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{ marginBottom: 20 }}
            />
            <Button
                type="primary"
                onClick={handleLogin}
                loading={loading}
                style={{ width: '100%' }}
            >
                Entrar
            </Button>
        </div>
    );
}

export default FazerLogin;
