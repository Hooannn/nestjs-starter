import { Role } from '../../../src/auth/auth.roles';
import { DefaultEntity } from '../../../src/utils/default.entity';
export class User extends DefaultEntity {
  readonly email: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly roles: Role[];
  readonly avatar?: string;
  readonly password?: string;
}
