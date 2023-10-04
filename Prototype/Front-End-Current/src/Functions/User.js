import { baseUrl } from "config";
import jwt from 'jwt-decode';

//Storage keys
const token = "BAtoken";
const exp = "EXP"

//Register User

//Log User In
export async function login(formData){
    return fetch(baseUrl + "/mst/user/login", {
        method: "POST",
        body: formData,
    }).then(response => (response.json()
    )).then((response) => {
        if (response.Success == true) {
                localStorage.setItem(token, response.Values);
                const t = jwt(response.Values)
                localStorage.setItem(exp, t.exp);
            }
            return response;
        }
    ).catch(function (error) {
         console.log(error);
         return error;
    })
}


//Check User Logged In
export function getToken(){
    const JWT = localStorage.getItem(token)
    if(JWT){
        const unixNow = Date.now() / 1000;
        const expUnix = localStorage.getItem(exp);
        if (unixNow < expUnix){
            return JWT
        }else{
            logout();
            return null;
        }
    } else {
        return null
    }
}


//Log user out
export async function logout(){
    try{
        fetch(baseUrl + "/mst/user/logout", {
            method: "POST"
        })
    } catch (error){
        console.log(error);
    }
    localStorage.clear();
}

export async function resendRegistraionEmail (email){
    const form = new FormData();
    form.append("email", email);
    const res = await fetch(baseUrl + "/mst/confirm/resend", {
        method: "POST",
        body: form
    });
    const jsonRes = await res.json();
    return jsonRes;

}