import axios from 'axios';
import {createContext, useContext, useState, useEffect} from 'react'


const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});


