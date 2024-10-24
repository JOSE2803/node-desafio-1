import { DatabaseActions } from "./databaseActions.js";
import { randomUUID } from "node:crypto";

export async function insert(req, res) {
    const { title, description } = req.body;

    if (typeof title === "undefined" || typeof description === "undefined") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Os campos 'title' e 'description' devem ser informados."}))
        return
    }

    if (typeof title !== "string" || typeof description !== "string") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Os campos 'title' e 'description' devem ser obrigatoriamente uma string."}))
        return
    }

    const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const taskString = Object.values(task).join(";")

    try {
        const database = new DatabaseActions()

        await database.insert(taskString)
    
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Registro inserido com sucesso", data: task }))
    } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Erro inesperado" }))
    }
}

export async function get(req, res) {
    try {
        const database = new DatabaseActions()
        const result = await database.get()

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Sucesso", data: result }))
    } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Erro inesperado" }))
    }
}

export async function put(req, res) {

    const { title, description } = req.body
    const { id } = req.params

    if (typeof title === "undefined" || typeof description === "undefined") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Os campos 'title' e 'description' devem ser informados."}))
        return
    }

    if (typeof title !== "string" || typeof description !== "string") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Os campos 'title' e 'description' devem ser obrigatoriamente uma string."}))
        return
    }

    try {
        const database = new DatabaseActions()
        const tasks = await database.get()
        const taskIndex = tasks.findIndex((item) => item.id === id)

        if (taskIndex === -1) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "O 'id' informado não existe." }))
            return
        }

        let updatedTask = tasks[taskIndex];

        if (updatedTask.completed_at) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "A tarefa já foi finalizada e não pode ser atualizada." }))
            return
        }

        updatedTask = {
            ...updatedTask,
            title,
            description,
            updated_at: new Date().toISOString()
        }

        database.put(tasks, updatedTask, taskIndex)

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Tarefa atualizada com sucesso.", data: updatedTask }))
    } catch (error) {
        console.log(error)
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Erro inesperado" }))
    }

}

export async function deleted(req, res) {

    const { id } = req.params

    try {
        const database = new DatabaseActions()
        const tasks = await database.get()
        const taskIndex = tasks.findIndex((item) => item.id === id)

        if (taskIndex === -1) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "O 'id' informado não existe." }))
            return
        }

        database.delete(tasks, id)

        res.writeHead(204, { "Content-Type": "application/json" });
        res.end()
    } catch (error) {
        console.log(error)
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Erro inesperado" }))
    }

}

export async function patch(req, res) {

    const { id } = req.params

    try {
        const database = new DatabaseActions()
        const tasks = await database.get()
        const taskIndex = tasks.findIndex((item) => item.id === id)

        if (taskIndex === -1) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "O 'id' informado não existe." }))
            return
        }

        let updatedTask = tasks[taskIndex];

        if (updatedTask.completed_at) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "A tarefa já foi finalizada." }))
            return
        }

        updatedTask = {
            ...updatedTask,
            completed_at: new Date().toISOString()
        }

        database.patch(tasks, updatedTask, taskIndex)

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Tarefa finalizada com sucesso.", data: updatedTask }))
    } catch (error) {
        console.log(error)
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Erro inesperado" }))
    }

}