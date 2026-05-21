import apiClient from "@/api/client";
import { UserInfo } from "./user.dto";


const UserService =  {
     fetchUserInfo : async () => {
    const response = await apiClient.get<UserInfo>('user');
    return response.data;
    }


   
}

export default UserService