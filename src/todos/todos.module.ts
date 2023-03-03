import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TodosSchema} from "./schema/todosSchema";

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [
    SequelizeModule.forFeature([TodosSchema])
  ]
})
export class TodosModule {}
