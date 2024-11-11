import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import InputMask from 'react-input-mask';
import { supabase } from "../../Supabase/createClient.js";
import './Login.css';

function Login() {
    // Estado para os dados do formulário
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Função para lidar com o envio do formulário
    const handleSubmit = async (values) => {
        const { nome, telefone, email, senha } = values;

        try {
            setLoading(true);

            // Inserir os dados na tabela usuarios_receita
            const { data, error } = await supabase
                .from('usuarios_receita')
                .insert([
                    { nome, telefone, email, senha }
                ]);

            if (error) {
                throw error;
            }

            // Mensagem de sucesso
            message.success('Usuário cadastrado com sucesso!');
            form.resetFields();  // Limpa o formulário após o envio

        } catch (error) {
            // Mensagem de erro
            message.error(`Erro ao cadastrar usuário: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Cadastro de Usuário</h2>
            <Form
                form={form}
                name="login-form"
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{
                    nome: '',
                    telefone: '',
                    email: '',
                    senha: ''
                }}
            >
                <Form.Item
                    label="Nome"
                    name="nome"
                    rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Telefone"
                    name="telefone"
                    rules={[{ required: true, message: 'Por favor, insira seu telefone!' }]}
                >
                    <InputMask mask="(99) 99999-9999" maskChar=" " placeholder="Telefone" />
                </Form.Item>

                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Por favor, insira um e-mail válido!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Senha"
                    name="senha"
                    rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cadastrar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;
