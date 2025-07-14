import { User, UserAPI } from "@/models/UserModel";

export interface TeamBlock {
  position: string;
  members: User[];
}
export interface TeamBlockAPI {
  position: string;
  members: UserAPI[];
}
