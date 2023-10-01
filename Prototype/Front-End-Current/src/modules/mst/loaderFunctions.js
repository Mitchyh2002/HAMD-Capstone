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
            return [];
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
    return fetch(baseUrl + "/mst/admin/getAllUsers", {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + getToken(),
        }
    })
        .then(res => res.json())
        .then(res => {
            return res;
        }).catch(error => {
            //if error return empty table
            return [];
        })
}

export function deactivateModule(form){
    return fetch(baseUrl + "/mst/module/deactivate",
    {
        method: "POST",
        headers: {
      'Authorization': "Bearer " + getToken(),
      },
        body: form
    })
    .then(res => res.json())
    .then(res => { return res })
}

export function activateModule(form){
    return fetch(baseUrl + "/mst/module/activate",
    {
        method: "POST",
        headers: {
      'Authorization': "Bearer " + getToken(),
      },
        body: form
    })
    .then(res => res.json())
    .then(res => { return res })
}

export async function adminCheck() {
    return fetch(baseUrl + "/mst/admin/adminCheckForRoutes", {
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

export async function getUser({ params }) {
    return fetch(baseUrl + "/mst/admin/getUser/" + params.id, {
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

export async function getConfig() {
    try{
    const res = await fetch(baseUrl + "/mst/config/", {
        method: 'GET',
        headers: {
            'Authorization': "Bearer " + getToken(),
        }
    })
    const resJson = await res.json();

    return resJson;
    } catch {
        return {values: [], Success: false}
    }
}