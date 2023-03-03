import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./schema/auth.schema";
import {JwtModule} from "@nestjs/jwt";
import {RefreshTokenStrategy} from "./strategys/refresh.strategy";
import {AccessTokenStrategy} from "./strategys/access.strategy";

@Module({
	imports: [
		JwtModule.register({}),
		SequelizeModule.forFeature([User])
	],
	controllers: [AuthController],
	providers: [AuthService,AccessTokenStrategy , RefreshTokenStrategy]
})
export class AuthModule {
}
