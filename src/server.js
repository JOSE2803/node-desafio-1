import http from "node:http"

import { handlingRequest } from "./handlingRequest.js"

const port = 3001
const server = http.createServer(async (req, res) => {

    const routeMatched = await handlingRequest(req, res)

    if (!routeMatched) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Recurso não encontrado."}))
    }
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`)
})