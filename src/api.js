const axios = require('axios');

const fetchOccasions =  async() => {
    return axios.get('/api/occasions');
};

const fetchDrinks =  async() => {
    return axios.get('/api/drinks');
};

const deleteDrink = (drink) => {
    return axios.delete(`/api/drinks/${drink.id}`);
};

const createDrink = async(drink) => {
    const response = await axios.post('/api/drinks', drink);
    return response.data;
};

export {
    fetchOccasions,
    fetchDrinks,
    createDrink,
    deleteDrink
}