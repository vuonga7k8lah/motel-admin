import axiosInstance from "@/configs/axios"

export const post = async (url:string,data:any) => {
    let result = await axiosInstance.post(url,data);
    if(result.data.code == 200){
        return result.data.data;
    }else{
        throw new Error(result.data.message);
    }
}
export const remote = async (url:string) => {
    let result = await axiosInstance.delete(url);

    if(result.data.code == 200){
        return result.data.data;
    }else{
        throw new Error(result.data.message);
    }
}
export const get = async (url:string) => {
    let result = await axiosInstance.get(url);
    
    if(result.data.code == 200){
        return result.data.data;
    }else{
        throw new Error(result.data.message);
    }
}

export const put = async (url:string,data:any) => {
    let result = await axiosInstance.put(url,data);
    if(result.data.code == 200){
        return result.data.data;
    }else{
        throw new Error(result.data.message);
    }
}