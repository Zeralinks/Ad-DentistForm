import api from "../api"

export async function login(data) {
    try{
        const response = await api.post("token/", data)
        return response.data

    }
    catch(err){
        if (err.status===401){
            throw new Error("Invalid Credentials")
        }

        throw new Error(err)

    }
    
}