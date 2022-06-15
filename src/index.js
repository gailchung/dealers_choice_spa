const api = require('./api');
// const { fetchOccasions, fetchDrinks } = api

// const occasionsList = document.querySelector('#occasions-list');
// const drinksList = document.querySelector('#drinks-list');

// const init = async()=> {
//     const [ occasions, drinks ] = await Promise.all([
//         fetchOccasions(),
//         fetchDrinks()
//     ]);
//     let html = occasions.map( occasion => {
//         return `
//         <li>
//         ${occasion.name}
//         </li>
//         `;
//     }).join('');
//     occasionsList.innerHTML = html

//      html = drinks.map( drink => {
//         return `
//          <li>
//         ${drink.name}
//         </li>
//         `;
//     }).join('');
//     drinksList.innerHTML = html
// };

// init();


const axios = require('axios');
const occasionsList = document.querySelector('#occasions-list');
const drinksList = document.querySelector('#drinks-list');
const resultsList = document.querySelector('#results-list');

window.addEventListener('hashchange', async()=> {
    renderOccasions();
    await fetchResults();
    renderResults();
    renderDrinks();

});


drinksList.addEventListener('click', async(ev)=> {
    if (ev.target.tagName === 'LI') {
        const drinkId = ev.target.getAttribute('data-id');
        const occasionId = window.location.hash.slice(1);
        const response = await axios.post(`/api/occasions/${occasionId}/results`,
        {
            drinkId
        });
        state.results.push(response.data);
        renderDrinks();
        renderResults();
    }
});

resultsList.addEventListener('click', async(ev)=> {
    if (ev.target.tagName === 'LI') {
        const resultId = ev.target.getAttribute('data-id')*1;
         await axios.delete(`/api/results/${resultId}`);
        state.results = state.results.filter(result => result.id !== resultId);
        renderDrinks();
        renderResults();
    }
});

const state = {
};

const fetchOccasions = async()=> {
    const response = await axios.get('/api/occasions');
    state.occasions = response.data;
};

const fetchDrinks = async() => {
    const response = await axios.get('/api/drinks');
    state.drinks = response.data
};

const fetchResults = async() => {
    const id = window.location.hash.slice(1);
    const response = await axios.get(`/api/occasions/${id}/results`);
    state.results = response.data
};

const renderOccasions = ()=> {
    const id = window.location.hash.slice(1)*1;
    const html = state.occasions.map(occasion => {
        return `
        <li>
        <a href='#${occasion.id}'>
        ${occasion.name}
        </a>
        </li>`;
    }).join('');
    occasionsList.innerHTML = html
}

const renderDrinks = ()=> {
    const html = state.drinks.map(drink => {
        return `
        <li data-id='${drink.id}'>
        ${drink.name}
        </li>`;
    }).join('');
    drinksList.innerHTML = html
}

const renderResults = ()=> {
    const html = state.results.map(result => {
        const drink =  state.drinks.find(drink => drink.id === result.drinkId)
        return `
        <li data-id='${result.id}'>
        ${drink.name}
        </li>`;
    }).join('');
    resultsList.innerHTML = html
};

const start = async() => {
    await fetchOccasions();
    await fetchDrinks();
    await fetchResults();
    renderOccasions();
    renderDrinks();
    renderResults();
};

start();