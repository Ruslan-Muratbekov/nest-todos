import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateNewUser} from "./dto/createNewUser";
import {UserEnter} from "./dto/userEnter";
import {Request} from 'express'
import {RefreshTokenGuard} from "../common/Guards/RefreshTokenGuard";
import {UserRefresh} from "./dto/userRefresh";
import {AccessTokenGuard} from "../common/Guards/AccessTokenGuard";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post('register')
	async userCreate(@Body() body: CreateNewUser) {
		return this.authService.userCreate(body.email, body.password)
	}

	@Post('login')
	async userEnter(@Body() body: UserEnter) {
		return this.authService.userEnter(body.email, body.password)
	}

	@Get('activated/:link')
	async userActivated(@Param('link') link: string) {
		return this.authService.userActivated(link)
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	async userRefresh(@Req() req: Request) {
		const user = new UserRefresh(req.user)
		return await this.authService.userRefresh(user)
	}

	@UseGuards(AccessTokenGuard)
	@Delete('user')
	async userDelete(@Req() req: Request) {
		const user = new UserRefresh(req.user)
		return await this.authService.userDelete(user)
	}

}
