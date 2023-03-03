import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import { TodosModule } from './todos/todos.module';

@Module({
	imports: [
		ConfigModule.forRoot({isGlobal: true}),
		SequelizeModule.forRoot({
			dialect: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			models: [],
			autoLoadModels: true
		}),
		AuthModule,
		TodosModule
	],
})
export class AppModule {
}
