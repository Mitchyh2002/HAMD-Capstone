import { baseUrl } from "config";

//Storage keys
const token = "BAtoken";

//Register User

//Log User In
export async function login(formData){
    return fetch(baseUrl + "/mst/user/login", {
        method: "POST",
        body: formData,
    }).then(response => (response.json()
    )).then((response) => {
        if (response.Success == true) {
                console.log(response)
                localStorage.setItem(token, response.Values);
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
        return JWT
    } else {
        return null
    }
}


//Log user out
export async function logout(){
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