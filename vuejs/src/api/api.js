import axios from 'axios';    

export const serverURI = 'http://159.203.128.74:3000';

// export const serverURI = 'http://localhost:3000';

// à changer
const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;


export function fetchData(route) {
    return axios.get((serverURI + route));
}

export function postData(route, data) {
    return axios.post(serverURI + route, data);
}

export function deleteData(route, data) {
    return axios.delete(serverURI + route + data);
}

export function patchData(route, data) {
    return axios.patch(serverURI + route, data);
}