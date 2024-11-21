import React, { useEffect, useState } from 'react';
import { supabase } from "../../Supabase/createClient.js";
import { useNavigate } from 'react-router-dom';

function Receitas() {
    const [user, setUser] = useState(null);
    const [receitas, setReceitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openRecipe, setOpenRecipe] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o texto de busca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const userEmail = localStorage.getItem('user_token');

            if (!userEmail) {
                navigate('/fzrlogin');
                return;
            }

            try {
                const { data: userData, error: userError } = await supabase
                    .from('usuarios_receita')
                    .select('nome')
                    .eq('email', userEmail)
                    .single();

                if (userError) throw userError;
                setUser(userData.nome);
            } catch (err) {
                setError(err.message);
            }

            try {
                const { data: receitasData, error: receitasError } = await supabase
                    .from('receitas')
                    .select('*');

                if (receitasError) throw receitasError;
                setReceitas(receitasData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const toggleRecipe = (id) => {
        setOpenRecipe(openRecipe === id ? null : id);
    };

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        setUser(null);
        navigate('/fzrlogin');
    };

    // Filtra as receitas com base no texto da busca
    const filteredReceitas = receitas.filter((receita) =>
        receita.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receita.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <p style={styles.loading}>Carregando...</p>;
    }

    if (error) {
        return <p style={styles.error}>Erro: {error}</p>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.headerContainer}>
                {user ? (
                    <p style={styles.welcome}>Bem-vindo, {user}!</p>
                ) : (
                    <p style={styles.noUser}>Nenhum usuário logado.</p>
                )}

                {user && (
                    <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
                )}
            </div>

            <h3 style={styles.subHeader}>Receitas disponíveis:</h3>

            {/* Campo de busca */}
            <input
                type="text"
                placeholder="Buscar por título ou autor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />

            {filteredReceitas.length > 0 ? (
                <ul style={styles.recipeList}>
                    {filteredReceitas.map((receita) => (
                        <li 
                            key={receita.id} 
                            style={styles.recipeItem}
                        >
                            <h4 style={styles.recipeTitle}>{receita.titulo}</h4>
                            {receita.imagem_url && (
                                <img
                                    src={`https://jrbpwisclowinultbehj.supabase.co/storage/v1/object/public/receitas-images/${receita.imagem_url}`}
                                    alt={receita.titulo}
                                    style={styles.recipeImage}
                                />
                            )}
                            <p style={styles.recipeAuthor}><strong>Autor:</strong> {receita.autor}</p>
                            <button
                                style={styles.toggleButton}
                                onClick={() => toggleRecipe(receita.id)}
                            >
                                {openRecipe === receita.id ? 'Ocultar Receita' : 'Mostrar Receita'}
                            </button>

                            {openRecipe === receita.id && (
                                <div style={styles.recipeDescriptionContainer}>
                                    <p style={styles.recipeDescription}>{receita.descricao}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={styles.noRecipes}>Não há receitas disponíveis.</p>
            )}
        </div>
    );
}

// Estilos aplicados via CSS-in-JS
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: '#f4f4f9',
        minHeight: '100vh',
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcome: {
        fontSize: '1.2em',
        color: '#4CAF50',
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    noUser: {
        fontSize: '1.2em',
        color: '#f44336',
    },
    subHeader: {
        fontSize: '1.5em',
        color: '#555',
        marginTop: '20px',
    },
    recipeList: {
        listStyleType: 'none',
        padding: '0',
    },
    recipeItem: {
        backgroundColor: 'rgb(255, 255, 255)',
        margin: '10px 0',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    recipeTitle: {
        fontSize: '1.4em',
        color: '#333',
        marginBottom: '10px',
    },
    recipeImage: {
        width: '20pc',
        height: 'auto',
        borderRadius: '8px',
        objectFit: 'cover',
        marginBottom: '15px',
    },
    recipeAuthor: {
        fontSize: '1.2em',
        color: '#555',
        marginBottom: '10px',
    },
    recipeDescriptionContainer: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#f4f4f9',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    recipeDescription: {
        fontSize: '1em',
        color: '#777',
    },
    toggleButton: {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '15px',
    },
    noRecipes: {
        fontSize: '1.2em',
        color: '#888',
        textAlign: 'center',
    },
    loading: {
        fontSize: '1.2em',
        color: '#888',
        textAlign: 'center',
    },
    error: {
        fontSize: '1.2em',
        color: '#f44336',
        textAlign: 'center',
    },
};

export default Receitas;
