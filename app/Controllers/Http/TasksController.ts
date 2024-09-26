import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'


export default class TasksController {

    public async index({ auth }: HttpContextContract) {
        const user = await auth.authenticate()
        const tasks = await Task.query().where('userId', user.id)
        return tasks
    }

    public async store({ request, auth }: HttpContextContract) {
        const user = await auth.authenticate()
        const { task } = request.only(['task'])
        const taskReturn = (await user).related('tasks').create({ task })
        return taskReturn
    }

    public async show({ response, params }: HttpContextContract) {
        try {
            const task = await Task.findByOrFail("id", params.id)
            return task
        } catch (error) {
            return response.status(404).json({ error: "Task not found" })

        }
    }

    public async update({ request, response, params }: HttpContextContract) {
        try {
            const { done } = request.only(['done'])
            const task = await Task.findByOrFail("id", params.id)
            task.merge({ done })
            await task.save()
            return task
        } catch (error) {
            return response.status(400).json({ error: "Task not found" })
        }
    }

    public async destroy({ response, params }: HttpContextContract) {
        try {
            const task = await Task.findByOrFail("id", params.id)
            await task.delete()
            return response.status(203).json({ message: "Task deleted" })  
        } catch (error) {
            return response.status(400).json({ error: "Task not found" })
        }

    }



}
