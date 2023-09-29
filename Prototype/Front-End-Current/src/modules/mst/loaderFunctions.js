import { getToken } from 'Functions/User';
import { baseUrl } from "config";
/*All loader functions to export for react Router */

export async function getPlugins() {
    return fetch(baseUrl + "/mst/module/getall", {
        headers: {
      'Authorization': "Bearer " + getToken(),
      }
    })
        .then(res => res.json())
        .then(res => {
            return res;
        }).catch(error => {
            return error;
        })
}

export function updateName(form) {
    return fetch(baseUrl + "/mst/module/updatereference",
        {
            method: "POST",
            body: form, 
            headers: {
                'Authorization': "Bearer " + getToken()
            }
        })
        .then(res => res.json())
        .then(res => { return res })
}

export async function getUsers() {
    return fetch(baseUrl + "/mst/admin/getallusers")
        .then(res => res.json())
        .then(res => {
            return res;
        }).catch(error => {
            return error;
        })
}

export function deactivateModule(prefix){
    return fetch(baseUrl + "/mst/module/deactivate",
    {
        method: "POST",
        headers: {
      'Authorization': "Bearer " + getToken(),
      },
        body: JSON.stringify({"modulePrefix" : prefix})
    })
    .then(res => res.json())
    .then(res => { return res })
}

export function activateModule(prefix){
    return fetch(baseUrl + "/mst/module/activate",
    {
        method: "POST",
        headers: {
      'Authorization': "Bearer " + getToken(),
      },
        body: JSON.stringify({"modulePrefix" : prefix})
    })
    .then(res => res.json())
    .then(res => { return res })
}

export async function getUser({params}) {
    return fetch(baseUrl + "/mst/admin/getUser/"+params.id,{
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + getToken(),
        }
    })
    .then(res => res.json())
        .then(res => {
            return res;
        }).catch(error => {
            return error;
        })
}