/*All loader functions to export for react Router */

export async function getPlugins(){
    return fetch("http://localhost:5000/module/getall").then(res => res.json()).then( res => {
        return res;
    }).catch(error => {
        return error;
    })
}

export function updateName(form){
    return fetch("http://localhost:5000/module/updatereference", 
        {method: "POST",
        body: form
        }
    ).then(res => res.json()).then( res => {return res})
}