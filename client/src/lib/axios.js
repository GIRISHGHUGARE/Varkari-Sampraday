// lib/axios.js
import axios from 'axios';

const client = axios.create({
    // baseURL: 'https://varkari-sampraday.onrender.com/api/v1',
    baseURL: 'http://192.168.0.109:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',  // Ensure proper content type
    }
});

export default client;