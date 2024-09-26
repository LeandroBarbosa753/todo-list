import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'


export default class UsersController {
  public async index() {
    const users = await User.query().preload('tasks')
    return users
  }

  public async store({ request }: HttpContextContract) {
    const { name, email, password } = request.only(['name', 'email', 'password'])
    const user = await User.create({
      name,
      email,
      password
    })
    return user
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const user = await User.findByOrFail("id", params.id)
      return user
    } catch (error) {
      return response.status(404).json({ error: "User not found" })

    }
  }

  public async update({ request, response, params }: HttpContextContract) { 
    try {
      const { name, email, password } = request.only(['name', 'email', 'password'])
      const user = await User.findByOrFail("id", params.id)
      user.merge({name, email, password})
      await user.save()
      return user
    } catch (error) { 
        return response.status(400).json({ error: "User not found" })
    }
  }

  public async destroy({response, params}: HttpContextContract) { 
    try {
      const user = await User.findByOrFail("id", params.id)
      await user.delete()
      return response.status(203).json({ message: "User deleted" })
    } catch (error) {
      return response.status(400).json({ error: "User not found" })
    }

  }


}
