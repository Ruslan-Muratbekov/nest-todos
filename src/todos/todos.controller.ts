import {Body, Controller, Delete, Get, Post, Put, Req, UseGuards} from '@nestjs/common';
import {AccessTokenGuard} from "../common/Guards/AccessTokenGuard";
import {TodosService} from "./todos.service";
import {Request} from 'express'
import {CreateTodo} from "./dto/createTodo";
import {UpdateTodo} from "./dto/updateTodo";

@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {
	}

	@UseGuards(AccessTokenGuard)
	@Post()
	async createTodo(@Req() req: Request, @Body() body: CreateTodo) {
		const user = req.user
		return await this.todosService.createTodo(user, body)
	}

	@UseGuards(AccessTokenGuard)
	@Get()
	async getAll(@Req() req: Request) {
		const user = req.user
		return await this.todosService.getAll(user)
	}

	@UseGuards(AccessTokenGuard)
	@Delete()
	async deleteTodo(@Req() req: Request, @Body('id') id: number) {
		const user = req.user
		return await this.todosService.deleteTodo(user, id)
	}

	@UseGuards(AccessTokenGuard)
	@Put()
	async updateTodo(@Req() req: Request, @Body() body: UpdateTodo) {
		const user = req.user
		return await this.todosService.updateTodo(user, body)
	}
}
