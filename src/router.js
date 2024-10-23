export function router() {

    const routes = []

    routes.push({
        method: "POST",
        url: "/tasks",
        handler: () => {
            console.log("PRIMEIRA ROTA")
        }
    })

    routes.push({
        method: "GET",
        url: "/tasks",
        handler: () => {
            console.log("SEGUNDA ROTA")
        }
    })

    routes.push({
        method: "PUT",
        url: "/tasks/:id",
        handler: () => {
            console.log("TERCEIRA ROTA")
        }
    })

    routes.push({
        method: "DELETE",
        url: "/tasks/:id",
        handler: () => {
            console.log("QUARTA ROTA")
        }
    })

    routes.push({
        method: "PATCH",
        url: "/tasks/:id/complete",
        handler: () => {
            console.log("QUINTA ROTA")
        }
    })

    return routes
    
}