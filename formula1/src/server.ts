import Fastify from "fastify";
import cors from "@fastify/cors";

const server = Fastify({
  logger: true,
});

// Plugins
await server.register(cors, {
  origin: true,
});

// Tipos
interface Team {
  id: number;
  name: string;
  base: string;
}

interface Driver {
  id: number;
  name: string;
  team: string;
}

// Dados (mantidos)
const teams: Team[] = [
  { id: 1, name: "McLaren", base: "Woking, United Kingdom" },
  { id: 2, name: "Mercedes", base: "Brackley, United Kingdom" },
  { id: 3, name: "Red Bull Racing", base: "Milton Keynes, United Kingdom" },
  { id: 4, name: "Ferrari", base: "Maranello, Italy" },
  { id: 5, name: "Alpine", base: "Enstone, United Kingdom" },
  { id: 6, name: "Aston Martin", base: "Silverstone, United Kingdom" },
  { id: 7, name: "Alfa Romeo Racing", base: "Hinwil, Switzerland" },
  { id: 8, name: "AlphaTauri", base: "Faenza, Italy" },
  { id: 9, name: "Williams", base: "Grove, United Kingdom" },
  { id: 10, name: "Haas", base: "Kannapolis, United States" },
  { id: 11, name: "Uralkali Haas F1 Team", base: "Banbury, United Kingdom" },
  { id: 12, name: "Scuderia Toro Rosso", base: "Faenza, Italy" },
];

const drivers: Driver[] = [
  { id: 1, name: "Max Verstappen", team: "Red Bull Racing" },
  { id: 2, name: "Lewis Hamilton", team: "Ferrari" },
  { id: 3, name: "Lando Norris", team: "McLaren" }, // corrigido
];

// Função utilitária
function findById<T extends { id: number }>(list: T[], id: number): T | undefined {
  return list.find((item) => item.id === id);
}

// Rotas
server.get("/teams", async () => {
  return {
    count: teams.length,
    data: teams,
  };
});

server.get("/drivers", async () => {
  return {
    count: drivers.length,
    data: drivers,
  };
});

server.get<{ Params: { id: string } }>(
  "/drivers/:id",
  async (request, reply) => {
    const id = Number(request.params.id);

    if (!id) {
      return reply.code(400).send({ error: "Invalid ID" });
    }

    const driver = findById(drivers, id);

    if (!driver) {
      return reply.code(404).send({ error: "Driver not found" });
    }

    return { data: driver };
  }
);

// Nova rota (melhoria)
server.get<{ Params: { id: string } }>(
  "/teams/:id",
  async (request, reply) => {
    const id = Number(request.params.id);

    if (!id) {
      return reply.code(400).send({ error: "Invalid ID" });
    }

    const team = findById(teams, id);

    if (!team) {
      return reply.code(404).send({ error: "Team not found" });
    }

    return { data: team };
  }
);

// Filtro por equipe (nova feature)
server.get<{ Querystring: { team?: string } }>(
  "/drivers/search",
  async (request) => {
    const { team } = request.query;

    if (!team) {
      return { data: drivers };
    }

    const filtered = drivers.filter((d) =>
      d.team.toLowerCase().includes(team.toLowerCase())
    );

    return {
      count: filtered.length,
      data: filtered,
    };
  }
);

// Start
const start = async () => {
  try {
    await server.listen({ port: 3333 });
    console.log("🚀 Server rodando em http://localhost:3333");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
