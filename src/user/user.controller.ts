import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @Get()
    public getUsers() {
        return this.userService.getAll();
    }

    @Post()
    public addUser(@Body() dto: UserDto){
        return this.userService.create(dto);
    }
    @Delete(":id")
    public deleteUser(@Param("id", ParseIntPipe) id: number){
        return this.userService.delete(id);
    }
}
