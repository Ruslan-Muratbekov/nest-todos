import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../auth/schema/auth.schema";

@Table
export class TodosSchema extends Model {
	@Column
	title: string

	@Column
	description: string

	@ForeignKey(() => User)
	userId: User
}