import { Role } from "./hotel";

export type User = {
  id: string;
  name: string;
  roles: Role[];
}
