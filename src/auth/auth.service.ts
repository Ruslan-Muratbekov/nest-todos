import {InjectModel} from "@nestjs/sequelize";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {User} from "./schema/auth.schema";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import * as nodemailer from 'nodemailer'
import {UserDto} from "./dto/userDto";
import {UserRefresh} from "./dto/userRefresh";

@Injectable()
export class AuthService {

	transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${process.env.SMTP_USERS}`,
			pass: `${process.env.SMTP_PASSWORD}`
		}
	})

	constructor(
		@InjectModel(User) private userModel: typeof User,
		private readonly jwtService: JwtService
	) {
	}

	async userCreate(email, password) {
		const candidate = await this.userModel.findOne({
			where: {
				email
			}
		})
		if (candidate) {
			throw new HttpException('Такой пользователь уже существует!', HttpStatus.BAD_REQUEST)
		}
		const hashPassword = await bcrypt.hash(password, 8)
		const activatedLink = uuid.v4()

		const user = await this.userModel.create({email, password: hashPassword, isActivated: false, activatedLink})
		const userDto = new UserDto(user)

		await this.sendActivationMail(email, `http://localhost:5000/auth/activated/${activatedLink}`)

		const tokens = await this.generateTokens({...userDto})
		user.refreshToken = tokens.refreshToken
		await user.save()
		return {...tokens, user: userDto}
	}

	async userEnter(email, password) {
		const candidate = await this.userModel.findOne({
			where: {
				email
			}
		})
		if(!candidate){
			throw new HttpException('Такого пользователя еще нету в базе', HttpStatus.BAD_REQUEST)
		}
		const verifyPassword = await bcrypt.compare(password, candidate.password)
		if(!verifyPassword){
			throw new HttpException('Пароль или почта не правильная!', HttpStatus.BAD_REQUEST)
		}

		const userDto = new UserDto(candidate)
		const tokens = await this.generateTokens({...userDto})
		candidate.refreshToken = tokens.refreshToken
		await candidate.save()
		return {...tokens, user: userDto}
	}

	async userActivated(link) {
		const user = await this.userModel.findOne({
			where: {
				activatedLink: link
			}
		})
		if(user){
			user.isActivated = true
			await user.save()
			return;
		}
		throw new HttpException('Ошибка ссылки или ссылка устарела!', HttpStatus.BAD_REQUEST)
	}

	async userRefresh(user: UserRefresh){
		const candidate = await this.userModel.findOne({
			where: {
				email: user.email
			}
		})
		if(!candidate){
			throw new HttpException('Ошибка! Такого пользователя нету', HttpStatus.UNAUTHORIZED)
		}
		const userDto = new UserDto(candidate)
		const tokens = await this.generateTokens({...userDto})
		candidate.refreshToken = tokens.refreshToken
		await candidate.save()
		return {...tokens, user: UserDto}
	}

	async userDelete(user){
		await this.userModel.destroy({
			where: {
				email: user.email
			}
		})
	}

	async generateTokens(payload) {
		const accessToken = this.jwtService.sign(
			payload,
			{
				expiresIn: '30m',
				secret: process.env.SECRET_ACCESS_KEY
			}
		)
		const refreshToken = this.jwtService.sign(
			payload,
			{
				expiresIn: '7d',
				secret: process.env.SECRET_REFRESH_KEY
			}
		)
		return {
			accessToken,
			refreshToken
		}
	}

	async sendActivationMail(to, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USERS,
			to,
			subject: `Активация аккаунта на ${process.env.API_URL}`,
			text: '',
			html: `
			<div>
					<h1>Для активации перейдите по ссылке</h1>
					<a href="${link}">${link}</a>	
			</div>`
		})
	}

}
