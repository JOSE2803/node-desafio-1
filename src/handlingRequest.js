import { router } from "./router.js"

export async function handlingRequest(req, res) {
    await bodyRequest(req)
    await queryParamsRequest(req)
    const routeMatched = await routeParamsRequest(req, res)

    return routeMatched
}

async function bodyRequest(req) {
    let body = ""

    for await (const chunk of req) {
        body += chunk.toString()
    }

    if (body) {
        req.body = JSON.parse(body)
    } else {
        req.body = {}
    }
}

async function queryParamsRequest(req) {

    const { url } = req

    const queryString = url.split("?")[1]
    const queryObject = {}

    const params = new URLSearchParams(queryString)

    for (const [key, value] of params.entries()) {
        queryObject[key] = value
    }

    req.query = queryObject
}

async function routeParamsRequest(req, res) {

    const { url, method } = req

    const path = url.split('?')[0] 

    let routeMatched = false

    function matchRoute(route, requestUrl) {
        const paramNames = []

        const regex = new RegExp(
            '^' + route.replace(/\/:([^\/]+)/g, (_, paramName) => {
                paramNames.push(paramName)
                return '/([^/]+)'
            }) + '$'
        )
    
        const match = requestUrl.match(regex)
    
        if (!match) return null
    
        const params = paramNames.reduce((acc, paramName, index) => {
            acc[paramName] = match[index + 1]
            return acc
        }, {})
    
        return params        
    }

    const routes = await router(req, res)

    for (const route of routes) {
        const params = matchRoute(route.url, path)

        if (route.method === method && params) {
            routeMatched = true
            req.params = params
            route.handler()
        }

    }

    return routeMatched
    
}