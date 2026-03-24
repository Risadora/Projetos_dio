import http, { IncomingMessage, ServerResponse } from "http";

// =====================
// MODELOS
// =====================
interface Episode {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  createdAt: Date;
}

interface Podcast {
  id: number;
  name: string;
  description: string;
  episodes: Episode[];
}

// =====================
// "BANCO DE DADOS" EM MEMÓRIA
// =====================
let podcasts: Podcast[] = [];
let podcastId = 1;
let episodeId = 1;

// =====================
// HELPERS
// =====================
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body ? JSON.parse(body) : {});
    });
  });
}

function send(res: ServerResponse, status: number, data: any) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// =====================
// CONTROLLERS
// =====================
function createPodcast(data: any) {
  const newPodcast: Podcast = {
    id: podcastId++,
    name: data.name,
    description: data.description,
    episodes: [],
  };

  podcasts.push(newPodcast);
  return newPodcast;
}

function listPodcasts() {
  return podcasts;
}

function addEpisode(podcastIdParam: number, data: any) {
  const podcast = podcasts.find((p) => p.id === podcastIdParam);
  if (!podcast) return null;

  const episode: Episode = {
    id: episodeId++,
    title: data.title,
    description: data.description,
    audioUrl: data.audioUrl,
    createdAt: new Date(),
  };

  podcast.episodes.push(episode);
  return episode;
}

function getFeed(podcastIdParam: number) {
  const podcast = podcasts.find((p) => p.id === podcastIdParam);
  if (!podcast) return null;

  return {
    podcast: podcast.name,
    totalEpisodes: podcast.episodes.length,
    episodes: podcast.episodes,
  };
}

// =====================
// SERVIDOR + ROTAS
// =====================
const server = http.createServer(async (req, res) => {
  const url = req.url || "";
  const method = req.method || "";

  // Criar podcast
  if (url === "/podcasts" && method === "POST") {
    const body = await parseBody(req);
    const podcast = createPodcast(body);
    return send(res, 201, podcast);
  }

  // Listar podcasts
  if (url === "/podcasts" && method === "GET") {
    return send(res, 200, listPodcasts());
  }

  // Adicionar episódio
  if (url.startsWith("/episodes/") && method === "POST") {
    const id = Number(url.split("/")[2]);
    const body = await parseBody(req);

    const episode = addEpisode(id, body);
    if (!episode) {
      return send(res, 404, { error: "Podcast não encontrado" });
    }

    return send(res, 201, episode);
  }

  // Feed do podcast
  if (url.startsWith("/feed/") && method === "GET") {
    const id = Number(url.split("/")[2]);
    const feed = getFeed(id);

    if (!feed) {
      return send(res, 404, { error: "Podcast não encontrado" });
    }

    return send(res, 200, feed);
  }

  // Rota padrão
  send(res, 404, { error: "Rota não encontrada" });
});

// =====================
// START
// =====================
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
