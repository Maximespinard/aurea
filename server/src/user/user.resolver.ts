import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL!';
  }
}
