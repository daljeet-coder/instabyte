import axios from "axios";
import { userdataType } from "./auth.actions";
export const addUserApi = async(data:userdataType)=>{
    try{
     let res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_USER}`,data)
     if(res.data.msg){
        let auth =await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}`)
        console.log(auth)
        return true
    }else{
        userLogoutApi()
        return false;
    }
    }catch(err){
        console.log(err)
    }
}
export const updateUserDataApi = async(data:userdataType)=>{
    try{
        let res = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${data.id}`)
        return res
    }catch(err){
        console.log(err)
    }
}

export const userLogoutApi = async()=>{
    try{
        let res = await axios.post(`${process.env.NEXT_PUBLIC_PROTECTED_URL}/logout`)
        return res
    }catch(err){
        return err
    }
}