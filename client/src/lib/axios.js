// lib/axios.js
import axios from 'axios';

const client = axios.create({
    // baseURL: 'https://varkari-sampraday.onrender.com/api/v1',
    baseURL: 'http://192.168.137.1:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',  // Ensure proper content type
    }
});

export default client;