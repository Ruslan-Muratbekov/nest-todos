import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TodosSchema} from "./schema/todosSchema";

@Injectable()
export class TodosService {
	constructor(@InjectModel(TodosSchema) private readonly todoSchema: typeof TodosSchema) {
	}

	async createTodo(user, body) {
		return await this.todoSchema.create({...body, userId: user.id})
	}

	async getAll(user) {
		const todos = await this.todoSchema.findAll({
			where: {
				userId: user.id
			}
		})
		return todos
	}

	async deleteTodo(user, id) {
		await this.todoSchema.destroy({
			where: {
				id,
				userId: user.id
			}
		})
	}

	async updateTodo(user, body){
		const todo = await this.todoSchema.findOne({
			where: {
				userId: user.id,
				id: body.id
			}
		})
		if(todo){
			todo.title = body.title
			todo.description = body.description
			await todo.save()
			throw new HttpException(`Успешно обновлено todo ${body.id}`, HttpStatus.OK)
		}
		throw new HttpException('Ошибка такого todo нету' , HttpStatus.BAD_REQUEST)
	}
}
