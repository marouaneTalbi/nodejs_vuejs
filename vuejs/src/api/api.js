import axios from 'axios';    

const serverURI = 'http://localhost:3000';

export function fetchData(route) {
    return axios.get((serverURI + route));
}

export function postData(url, data) {
    return axios.post(url, data);
}

export function deleteData(route, data) {
    return axios.delete(serverURI + route + data);
}

export function patchData(route, data) {
    return axios.patch(serverURI + route, data);
}
