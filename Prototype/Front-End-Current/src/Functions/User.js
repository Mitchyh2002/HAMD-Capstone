//Storage keys
const token = "BAtoken";

//Register User

//Log User In
export async function login(formData){
    return fetch("http://localhost:5000/user/login", {
        method: "POST",
        body: formData,
    }).then(response => (response.json()
    )).then((response) => {
        if (response.Success == true) {
                console.log(response)
                localStorage.setItem(token, response.Values);
                return("Success");
            } else {
                return("error");
            }

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