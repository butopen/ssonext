import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {SNUserWithoutId} from "./user.model";
import {Tenant} from "../tenant/tenant.decorator";

@Controller('user-api')
export class UserAPIController {

    constructor(
        private readonly userService: UserService
    ) {
    }


    @Post()
    create(@Body() user: SNUserWithoutId, @Tenant() tenant: string) {
        return this.userService.createUser(user);
    }

    @Get()
    async findAll(page = 0, size = 10, @Tenant() tenant: string) {
        const users = await this.userService.allUsers(page, size, tenant);
        users.forEach(u => delete u.password)
        return users
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Tenant() tenant: string) {
        const user = await this.userService.findUserById(+id, tenant);
        if (user.length == 0)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        delete user[0].password
        return user
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Tenant() tenant: string) {
        const user = await this.findOne(id, tenant)
        if (user.length == 0)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        return await this.userService.deleteUser(+id, tenant);
    }


    @Get("email-exists")
    async checkEmail(email: string, @Tenant() tenant: string) {
        let exists = await this.userService.userWithEmailExists(email, tenant)
        return {exists}
    }

}
