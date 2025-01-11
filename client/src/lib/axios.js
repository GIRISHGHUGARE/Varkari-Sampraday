// lib/axios.js
import axios from 'axios';

const client = axios.create({
    baseURL: 'http://192.168.0.112:8080/api/v1', // Replace with your API URL
});

export default client;