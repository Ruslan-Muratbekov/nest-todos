import {PartialType} from "@nestjs/mapped-types";
import {CreateNewUser} from "./createNewUser";

export class UserEnter  extends PartialType(CreateNewUser){}