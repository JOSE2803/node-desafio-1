import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, access, appendFile } from 'node:fs/promises'
import { parse } from "csv-parse/sync";
import { stringify } from 'csv-stringify/sync';
import { Console } from "node:console";

export class DatabaseActions {

    #__filename = fileURLToPath(import.meta.url)
    #__dirname = path.dirname(this.#__filename)
    #filePath = path.join(this.#__dirname, 'database', 'tasks.csv')

    async #initializeCsv() {
        const fileExists = await this.#fileExists()

        if (!fileExists) {
            await this.#createCsv()
        }
    }

    async #fileExists() {
        try {
          await access(this.#filePath)
          return true
        } catch {
          return false
        }
      }

    async #createCsv() {

        const header = [
            "id",
            "title",
            "description",
            "completed_at",
            "created_at",
            "updated_at"
        ]

        await writeFile(this.#filePath, header.join(";") + "\n", "utf-8")
    }

    async insert(line) {
        try {
            await this.#initializeCsv()
            await appendFile(this.#filePath, `${line}\n`, "utf-8")
        } catch (error) {
            throw error
        }
    }

    async put(tasks, updatedTask, taskIndex) {
        try {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
            const newTasks = stringify(tasks, {
                header: true,
                delimiter: ";"
            })
            await writeFile(this.#filePath, newTasks, "utf-8")
        } catch (error) {
            throw error
        }
    }

    async delete(tasks, id) {
        try {
            tasks = tasks.filter((task) => task.id !== id)

            if (!tasks || tasks.length <= 0) {
                await this.#createCsv()
            } else {
                const newTasks = stringify(tasks, {
                    header: true,
                    delimiter: ";"
                })
                await writeFile(this.#filePath, newTasks, "utf-8")
            }
        } catch (error) {
            throw error
        }
    }

    async get() {
        try {
            await this.#initializeCsv()
            const data = await readFile(this.#filePath, "utf-8")
            const parsed = parse(data, {
                skipEmptyLines: true,
                columns: true,
                delimiter: ";"
            })
            return parsed
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async patch(tasks, updatedTask, taskIndex) {
        try {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
            const newTasks = stringify(tasks, {
                header: true,
                delimiter: ";"
            })
            await writeFile(this.#filePath, newTasks, "utf-8")
        } catch (error) {
            throw error
        }
    }

}