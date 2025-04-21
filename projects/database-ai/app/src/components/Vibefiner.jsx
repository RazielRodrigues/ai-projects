import { useState } from "react";
import { Button, Typography, Tooltip } from "@material-tailwind/react";
import { Fade } from "react-awesome-reveal";

const Vibify = () => {
    // Estado pras vibes
    const [vibes] = useState([
        { id: 1, type: "Skill", content: "Faço um drink matador em 20 min", value: "R$ 20", depoiments: ["Eduardo, Carlos,Jaiara..."], calls: 2, icon: "🛠️", tooltip: "Habilidades que eu domino" },
        { id: 2, type: "Moment", content: "Fui no show sozinho e curti pra krl", value: "Grátis", depoiments: ["Eduardo, Carlos,Jaiara..."], calls: 0, icon: "🌟", tooltip: "O que estou aprendendo" },
        { id: 3, type: "Craft", content: "Montei uma playlist irada pro rolê", value: "Troca por foto", depoiments: ["Eduardo, Carlos,Jaiara..."], calls: 1, icon: "🎨", tooltip: "Criações únicas que eu fiz" },
    ]);

    // Estado pra timeline (JSON)
    const [timelinePosts, setTimelinePosts] = useState([
        { id: 1, content: "Hoje o dia tá pedindo um café forte", timestamp: "2025-03-31T10:00:00Z" },
        { id: 2, content: "Acabei de sair do trampo, livre!", timestamp: "2025-03-31T18:30:00Z" },
        { id: 3, content: "Noite de série e pipoca, top!", timestamp: "2025-03-31T20:00:00Z" },
        { id: 4, content: "Treino pesado hoje, suado!", timestamp: "2025-03-31T22:00:00Z" },
    ]);
    const [newPost, setNewPost] = useState("");
    const [viewMode, setViewMode] = useState("carousel"); // Carousel ou Timeline
    const [carouselStart, setCarouselStart] = useState(0); // Índice inicial do carrossel

    // Dados do usuário
    const userData = {
        name: "Raziel Rodrigues",
        photo: "https://avatars.githubusercontent.com/u/40905332?v=4",
        vibeCount: 3,
        location: "São Paulo",
        bio: "Vivendo o corre dos 20s. Drinks, rolês e playlists no talo.",
    };

    // Adiciona novo post na timeline
    const handleAddPost = () => {
        if (newPost.trim() && newPost.length <= 280) {
            const newPostData = {
                id: timelinePosts.length + 1,
                content: newPost,
                timestamp: new Date().toISOString(),
            };
            setTimelinePosts([newPostData, ...timelinePosts]);
            setNewPost("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddPost();
        }
    };

    // Navega no carrossel
    const moveCarousel = (direction) => {
        if (direction === "next" && carouselStart + 3 < timelinePosts.length) {
            setCarouselStart(carouselStart + 1);
        } else if (direction === "prev" && carouselStart > 0) {
            setCarouselStart(carouselStart - 1);
        }
    };

    return (
        <section className="relative bg-gray-900 md:h-full md:w-full sm:h-full sm:w-full">
            <div className="grid md:grid-cols-2 sm:grid-cols-1 w-full place-items-center text-left">
                {/* Coluna Esquerda - Perfil */}
                <div className="w-3/4 text-left md:w-3/4 mt-5">
       
                    <div className="my-2">
                        {/* Perfil */}
                        <div className="editor bg-gray-800 p-4 rounded-md text-gray-300 text-wr mb-5">
                            <img src={userData.photo} alt={userData.name} className="w-32 h-32 rounded-full border-2 border-gray-700 mx-auto mb-4" />
                            <Typography variant="h5" className="text-center text-gray-300 mb-2">
                                <Fade delay={1e2} cascade damping={1e-1} className="mb-4 text-xl md:text-4xl lg:text-5xl font-bold text-center text-gray-300" triggerOnce>
                                    {userData.name}
                                </Fade>
                            </Typography>
                            <Typography variant="lead" className="opacity-80 text-center">
                                Vibes Trocadas: {userData.vibeCount}
                            </Typography>
                            <Typography variant="paragraph" className="opacity-80 text-center mt-2">
                                {userData.location}
                            </Typography>
                            <Typography variant="paragraph" className="opacity-80 text-center mt-2">
                                {userData.bio}
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita - Vibes como Cards Horizontais */}
                <div className="w-4/4 text-left md:w-4/4">
                    <div className="editor bg-gray-800 p-4 rounded-md text-gray-300 flex flex-col gap-3">
                        <Typography variant="h6" className="text-gray-300 mb-2">
                            Minhas Vibes
                        </Typography>
                        <div className="grid grid-cols-3 gap-4">
                            {vibes.map((vibe) => (
                                <Tooltip key={vibe.id} content={vibe.tooltip} placement="top" className="bg-gray-700 text-gray-300 p-2 rounded">
                                    <div className="bg-gray-700 p-4 rounded-lg flex flex-col gap-2 hover:bg-gray-600 transition duration-300">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{vibe.icon}</span>
                                            <p className="text-sm font-bold text-gray-300">{vibe.type} Vibe</p>
                                        </div>
                                        <p className="text-sm text-gray-100">{vibe.content}</p>
                                        <p className="text-xs text-gray-100">Vale: {vibe.value}</p>
                                        <p className="text-xs text-gray-100">Depoimentos: {vibe.depoiments}</p>
                                        <Button
                                            className="bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 w-24 text-xs mt-2 w-full"
                                            style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", border: "1px solid #757575" }}
                                        >
                                            ADERIR
                                        </Button>
                                    </div>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline - Largura Total */}
            <div className="w-full px-4 mt-5">
                <div className="editor bg-gray-800 p-4 rounded-md text-gray-300 flex flex-col gap-3 mx-auto max-w-3xl">
                    <div className="mt-4">
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-gray-900 text-gray-300 placeholder:text-gray-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow resize-none"
                            rows="3"
                            maxLength={280}
                            placeholder="O que tá rolando? (máx. 280)"
                        />
                    </div>
                    <Button
                        onClick={handleAddPost}
                        className="mt-4 w-full text-gray-300 bg-gray-800 rounded-lg transition duration-300 hover:bg-gray-700"
                        style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", border: "1px solid #757575" }}
                    >
                        Postar
                    </Button>
                </div>

                <div className="editor bg-gray-800 p-4 rounded-md text-gray-300 flex flex-col gap-3 mx-auto max-w-3xl mt-5">
                    <div className="flex justify-between items-center mb-2">
                        <Typography variant="h6" className="text-gray-300">
                            Timeline
                        </Typography>
                        <Button
                            className="bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-xs"
                            style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", border: "1px solid #757575" }}
                            onClick={() => setViewMode(viewMode === "carousel" ? "timeline" : "carousel")}
                        >
                            Ver como {viewMode === "carousel" ? "Timeline" : "Carrossel"}
                        </Button>
                    </div>
                    {viewMode === "carousel" ? (
                        <div className="flex items-center gap-3">
                            <Button
                                className="bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 w-8 h-8"
                                style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", border: "1px solid #757575" }}
                                onClick={() => moveCarousel("prev")}
                                disabled={carouselStart === 0}
                            >
                                ◀
                            </Button>
                            <div className="flex gap-3 flex-1 overflow-hidden">
                                {timelinePosts.slice(carouselStart, carouselStart + 3).map((post) => (
                                    <div key={post.id} className="flex flex-col gap-1 bg-gray-700 p-3 rounded-lg w-1/3">
                                        <p className="text-sm text-gray-300">{post.content}</p>
                                        <p className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className="bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 w-8 h-8"
                                style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", border: "1px solid #757575" }}
                                onClick={() => moveCarousel("next")}
                                disabled={carouselStart + 3 >= timelinePosts.length}
                            >
                                ▶
                            </Button>
                        </div>
                    ) : (
                        <div className="h-60 overflow-y-auto flex flex-col gap-3">
                            {timelinePosts.map((post) => (
                                <div key={post.id} className="flex flex-col gap-1 bg-gray-700 p-3 rounded-lg">
                                    <p className="text-sm text-gray-300">{post.content}</p>
                                    <p className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Vibify;