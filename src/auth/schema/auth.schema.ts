import {BelongsTo, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {TodosSchema} from "../../todos/schema/todosSchema";

@Table
export class User extends Model {
	@Column({type: DataType.STRING})
	email: string

	@Column({type: DataType.STRING})
	password: string

	@Column({type: DataType.BOOLEAN})
	isActivated: boolean

	@Column({type: DataType.STRING})
	activatedLink: string

	@Column({type: DataType.STRING, defaultValue: null})
	refreshToken: string

	@HasMany(() => TodosSchema, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	todos: TodosSchema[]
}