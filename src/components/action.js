import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});


export const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await API.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('GET request error:', error.response || error);
    throw error;
  }
};

export const postData = async (endpoint, data, config = {}) => {
  try {
    if (data instanceof FormData) {
      config.headers = { ...config.headers };
    }

    const response = await API.post(endpoint, data, config);
    return response
  } catch (error) {
    console.error('POST request error:', error.response?.data || error.message);
    throw error;
  }
};



export const putData = async (endpoint, data, config = {}) => {
  try {
    const response = await API.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error('PUT request error:', error.response || error);
    throw error;
  }
};


export const deleteData = async (endpoint, config = {}) => {
  try {
    const response = await API.delete(endpoint, config);
    return response.data;
  } catch (error) {
    console.error('DELETE request error:', error.response || error);
    throw error;
  }
};

export default API;
