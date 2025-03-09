// lib/axios.js
import axios from 'axios';

const client = axios.create({
    baseURL: 'http://ip:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',  // Ensure proper content type
    }
});

export default client;