// lib/axios.js
import axios from 'axios';

const client = axios.create({
    baseURL: 'http://10.0.98.44:8080/api/v1', // Replace with your API URL
});

export default client;