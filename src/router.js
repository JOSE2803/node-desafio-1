import { insert, get, put, deleted, patch } from "./controller.js"

export async function router(req, res) {

    const routes = []

    routes.push({
        method: "POST",
        url: "/tasks",
        handler: async () => {
            await insert(req, res)
        }
    })

    routes.push({
        method: "GET",
        url: "/tasks",
        handler: async () => {
            await get(req, res)
        }
    })

    routes.push({
        method: "PUT",
        url: "/tasks/:id",
        handler: async () => {
            await put(req, res)
        }
    })

    routes.push({
        method: "DELETE",
        url: "/tasks/:id",
        handler: async () => {
            await deleted(req, res)
        }
    })

    routes.push({
        method: "PATCH",
        url: "/tasks/:id/complete",
        handler: async () => {
            await patch(req, res)
        }
    })

    return routes
    
}