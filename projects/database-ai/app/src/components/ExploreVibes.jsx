import { useState, useEffect, useCallback } from "react";
import { Button, Typography, Tooltip, Input } from "@material-tailwind/react";
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";

const ExploreVibes = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Dados mockados de usuários com 3 vibes cada
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Raziel Rodrigues",
            photo: "https://avatars.githubusercontent.com/u/40905332?v=4",
            location: "São Paulo",
            vibes: [
                { id: 1, type: "Skill", content: "Faço um drink matador em 20 min", value: "R$ 20", icon: "🛠️" },
                { id: 2, type: "Moment", content: "Fui no show sozinho e curti pra krl", value: "Grátis", icon: "🌟" },
                { id: 3, type: "Craft", content: "Montei uma playlist irada pro rolê", value: "Troca por foto", icon: "🎨" },
            ]
        },
        {
            id: 2,
            name: "Marina Silva",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Rio de Janeiro",
            vibes: [
                { id: 4, type: "Craft", content: "Montei uma playlist irada pro rolê", value: "Troca por foto", icon: "🎨" },
                { id: 5, type: "Skill", content: "Ensino violão em 5 aulas", value: "R$ 50", icon: "🛠️" },
                { id: 6, type: "Moment", content: "Viajei sozinha pela América do Sul", value: "Dicas de viagem", icon: "🌟" },
            ]
        },
        {
            id: 3,
            name: "Lucas Oliveira",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Belo Horizonte",
            vibes: [
                { id: 7, type: "Moment", content: "Escalei o Pico da Bandeira sozinho", value: "Grátis", icon: "🌟" },
                { id: 8, type: "Craft", content: "Faço esculturas com materiais reciclados", value: "R$ 30", icon: "🎨" },
                { id: 9, type: "Skill", content: "Ensino programação para iniciantes", value: "R$ 45/hora", icon: "🛠️" },
            ]
        },
        {
            id: 4,
            name: "Carolina Mendes",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Salvador",
            vibes: [
                { id: 10, type: "Skill", content: "Ensino receitas veganas", value: "R$ 40/aula", icon: "🛠️" },
                { id: 11, type: "Craft", content: "Produzo cervejas artesanais", value: "Troca por outra bebida", icon: "🎨" },
                { id: 12, type: "Moment", content: "Participei de um retiro de meditação", value: "Dicas de mindfulness", icon: "🌟" },
            ]
        },
        {
            id: 5,
            name: "Pedro Almeida",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Curitiba",
            vibes: [
                { id: 13, type: "Moment", content: "Acampei nas montanhas durante 3 dias", value: "Dicas de camping", icon: "🌟" },
                { id: 14, type: "Skill", content: "Conserto quase qualquer tipo de bike", value: "R$ 25", icon: "🛠️" },
                { id: 15, type: "Craft", content: "Faço desenhos personalizados", value: "R$ 35", icon: "🎨" },
            ]
        },
        {
            id: 6,
            name: "Ana Santos",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Florianópolis",
            vibes: [
                { id: 16, type: "Skill", content: "Dou aulas de surf para iniciantes", value: "R$ 60/hora", icon: "🛠️" },
                { id: 17, type: "Moment", content: "Atravessei a ilha a pé em um dia", value: "Grátis", icon: "🌟" },
                { id: 18, type: "Craft", content: "Faço prancha de surf artesanal", value: "R$ 200", icon: "🎨" },
            ]
        },
        {
            id: 7,
            name: "Thiago Mendonça",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Recife",
            vibes: [
                { id: 19, type: "Craft", content: "Componho músicas para eventos", value: "R$ 100", icon: "🎨" },
                { id: 20, type: "Skill", content: "Ensino fotografia com smartphone", value: "R$ 30/hora", icon: "🛠️" },
                { id: 21, type: "Moment", content: "Conheci todos os museus da cidade", value: "Tour pelos museus", icon: "🌟" },
            ]
        },
        {
            id: 8,
            name: "Juliana Costa",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Brasília",
            vibes: [
                { id: 22, type: "Moment", content: "Assisti ao nascer do sol no Congresso", value: "Grátis", icon: "🌟" },
                { id: 23, type: "Skill", content: "Ensino pilates em casa", value: "R$ 50/hora", icon: "🛠️" },
                { id: 24, type: "Craft", content: "Faço bolos decorados personalizados", value: "A partir de R$ 80", icon: "🎨" },
            ]
        },
        {
            id: 9,
            name: "Henrique Lima",
            photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
            location: "Porto Alegre",
            vibes: [
                { id: 25, type: "Skill", content: "Conserto instrumentos musicais", value: "Preços variados", icon: "🛠️" },
                { id: 26, type: "Craft", content: "Produzo trilhas sonoras para vídeos", value: "R$ 120", icon: "🎨" },
                { id: 27, type: "Moment", content: "Assisti a todos os jogos do Inter no Beira-Rio", value: "Companhia para jogos", icon: "🌟" },
            ]
        },
    ]);

    // Filtra os usuários com base no termo de busca
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.vibes.some(vibe =>
            vibe.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vibe.type.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Função para carregar mais usuários (simula API)
    const loadMoreUsers = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulando um delay de API
        setTimeout(() => {
            // Gera mais 9 usuários de exemplo para completar o grid 3x3
            const newUsers = Array.from({ length: 9 }, (_, i) => {
                const id = users.length + i + 1;
                return {
                    id,
                    name: `Usuário ${id}`,
                    photo: "https://fastly.picsum.photos/id/971/200/300.jpg",
                    location: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Porto Alegre"][Math.floor(Math.random() * 5)],
                    vibes: [
                        {
                            id: id * 10 + 1,
                            type: ["Skill", "Moment", "Craft"][Math.floor(Math.random() * 3)],
                            content: `Vibe exemplo ${id * 10 + 1}`,
                            value: "R$ " + Math.floor(Math.random() * 50),
                            icon: ["🛠️", "🌟", "🎨"][Math.floor(Math.random() * 3)]
                        },
                        {
                            id: id * 10 + 2,
                            type: ["Skill", "Moment", "Craft"][Math.floor(Math.random() * 3)],
                            content: `Vibe exemplo ${id * 10 + 2}`,
                            value: "R$ " + Math.floor(Math.random() * 50),
                            icon: ["🛠️", "🌟", "🎨"][Math.floor(Math.random() * 3)]
                        },
                        {
                            id: id * 10 + 3,
                            type: ["Skill", "Moment", "Craft"][Math.floor(Math.random() * 3)],
                            content: `Vibe exemplo ${id * 10 + 3}`,
                            value: "R$ " + Math.floor(Math.random() * 50),
                            icon: ["🛠️", "🌟", "🎨"][Math.floor(Math.random() * 3)]
                        },
                    ]
                };
            });

            setUsers(prev => [...prev, ...newUsers]);
            setPage(prev => prev + 1);
            setLoading(false);

            // Se já tiver mais de 36 usuários, simula o fim da lista
            if (users.length + newUsers.length > 36) {
                setHasMore(false);
            }
        }, 1000);
    }, [loading, hasMore, users.length]);

    // Hook para detectar quando chegou ao fim da página
    useEffect(() => {
        const handleScroll = () => {
            // Se estiver próximo do final da página e não estiver carregando
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.scrollHeight - 100 &&
                !loading &&
                hasMore
            ) {
                loadMoreUsers();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, loadMoreUsers]);

    // Navegar para o perfil do usuário
    const navigateToProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <section className="relative bg-gray-900 min-h-screen w-full p-4">
            <div className="max-w-7xl mx-auto">
                <Fade delay={100} className="mb-8" triggerOnce>
                    <Typography variant="h3" className="text-center text-gray-300 mb-8">
                        Explorar Vibes
                    </Typography>
                </Fade>

                {/* Campo de Busca */}
                <div className="mb-8 max-w-md mx-auto">
                    <div className="relative flex w-full">
                        <Input
                            type="text"
                            placeholder="Buscar por pessoas, vibes, localidades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-800 text-gray-300 border-gray-700 rounded-lg px-4 py-2 w-full"
                        />
                    </div>
                </div>

                {/* Grid de Cards 3x3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => navigateToProfile(user.id)}
                            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition duration-300 shadow-lg"
                        >
                            <UserCard user={user} />
                        </div>
                    ))}
                </div>

                {/* Indicador de carregamento */}
                {loading && (
                    <div className="text-center mt-8 p-4">
                        <Typography variant="h6" className="text-gray-400">
                            Carregando mais pessoas...
                        </Typography>
                    </div>
                )}

                {/* Mensagem quando não há mais conteúdo */}
                {!hasMore && !loading && users.length > 0 && (
                    <div className="text-center mt-8 p-4">
                        <Typography variant="h6" className="text-gray-400">
                            Você chegou ao fim da lista!
                        </Typography>
                    </div>
                )}

                {/* Mensagem quando não há resultados */}
                {filteredUsers.length === 0 && !loading && (
                    <div className="text-center mt-8 p-4">
                        <Typography variant="h6" className="text-gray-400">
                            Nenhum resultado encontrado para "{searchTerm}"
                        </Typography>
                    </div>
                )}

                {/* Botão para carregar mais (alternativa para scroll) */}
                {hasMore && !loading && (
                    <div className="text-center mt-8">
                        <Button
                            onClick={loadMoreUsers}
                            className="bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
                            style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", border: "1px solid #757575" }}
                        >
                            Carregar Mais
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

// Componente de Card do Usuário
const UserCard = ({ user }) => {
    return (
        <div className="flex flex-col p-4">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={user.photo}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-700 object-cover"
                />
                <div>
                    <Typography variant="h6" className="text-gray-300">
                        {user.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-400">
                        {user.location}
                    </Typography>
                </div>
            </div>

            <div className="mt-2">
                <Typography variant="paragraph" className="text-gray-400 mb-2">
                    Vibes disponíveis:
                </Typography>
                <div className="grid grid-cols-1 gap-2">
                    {user.vibes.map((vibe) => (
                        <Tooltip key={vibe.id} content={`${vibe.type} Vibe`} placement="top" className="bg-gray-700 text-gray-300 p-2 rounded">
                            <div className="bg-gray-700 p-3 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition duration-300">
                                <span className="text-xl">{vibe.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-100">{vibe.content}</p>
                                    <p className="text-xs text-gray-400">Vale: {vibe.value}</p>
                                </div>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExploreVibes;