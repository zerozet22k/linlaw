import { User, UserAPI } from "@/models/UserModel";

export interface TeamBlock {
  teamName: string;
  members: User[];
}

export interface TeamBlockAPI {
  teamName: string;
  members: UserAPI[];
}
