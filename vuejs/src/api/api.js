import axios from 'axios';    

const serverURI = 'http://localhost:3000';

export function fetchAllData(route) {
    return axios.get((serverURI + route));
}

export function postData(url, data) {
    return axios.post(url, data);
}

