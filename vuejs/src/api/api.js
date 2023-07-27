import axios from 'axios';    
import Cookies from 'js-cookie';

// prod
export const serverURI = 'https://challenge.ovh:3000';


// export const serverURI = 'http://localhost:3000';
// import.meta.env.VITE_API_URL_SERVER_URL


axios.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

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

export function putData(route, data) {
    return axios.put(serverURI + route, data);
}