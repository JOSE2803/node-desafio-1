import http from "node:http"

import { handlingRequest } from "./handlingRequest.js"

const port = 3001
const server = http.createServer(async (req, res) => {

    const routeMatched = await handlingRequest(req)

    if (routeMatched) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(req.body))
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end()
    }
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`)
})