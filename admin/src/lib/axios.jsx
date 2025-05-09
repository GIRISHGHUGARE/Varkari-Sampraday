// lib/axios.js
import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Replace with your API URL
});

export default client;