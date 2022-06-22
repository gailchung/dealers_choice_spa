import React from 'react';
import ReactDOM from 'react-dom';
import { fetchOccasions, fetchDrinks, createDrink, deleteDrink} from './api';

// const state = {
// };


// const occasionsList = document.querySelector('#occasions-list');
// const drinksList = document.querySelector('#drinks-list');



// const fetchOccasions = async()=> {
//     const response = await api.fetchOccasions();
//     state.occasions = response.data;
// };

// const fetchDrinks = async() => {
//     const response = await api.fetchDrinks();
//     state.drinks = response.data
// };



// const renderOccasions = ()=> {
//     const id = window.location.hash.slice(1)*1;
//     const html = state.occasions.map(occasion => {
//         return `
//         <li>
//         ${occasion.name}
//         </li>`;
//     }).join('');
//     occasionsList.innerHTML = html
// }

// const renderDrinks = ()=> {
//     const html = state.drinks.map(drink => {
//         return `
//         <li>
//         ${drink.name}
//         </li>`;
//     }).join('');
//     drinksList.innerHTML = html
// }


// const start = async() => {
//     await fetchOccasions();
//     await fetchDrinks();
//     renderOccasions();
//     renderDrinks();
  
// };

// start();
const Occasions = ({occasions}) => {
    return (
        <ul>
        {
            occasions.map (occasion => {
                return <li key={occasion.id}>{occasion.name} </li>
             })
        }
        </ul>
    );
};

const Drinks = ({drinks, deleteADrink}) => {
    return (
        <ul>
        {
            drinks.map(drink => {
                return <li key= {drink.id}>{drink.name} <button onClick={()=> deleteADrink(drink)}>Delete</button></li>
            })
        }
        </ul>
    );
};
class App extends React.Component{
    constructor() {
        super();
        this.state = {
            occasions: [],
            drinks: []
        };
        this.createADrink = this.createADrink.bind(this);
        this.deleteADrink = this.deleteADrink.bind(this);

    }
    async componentDidMount() {
        let response = await fetchOccasions();
        this.setState({occasions: response.data});
         response = await fetchDrinks();
        this.setState({drinks: response.data});
    }


    async createADrink() {
        const drink = await createDrink({ name: Math.random() });
        const drinks = [...this.state.drinks, drink];
        this.setState({ drinks });
      }

      async deleteADrink(drink) {
          await deleteDrink(drink);
          const drinks = this.state.drinks.filter(_drink => _drink.id!== drink.id);
          this.setState({drinks});
        
      }


    render() {
        const {occasions, drinks} = this.state;
        const {createADrink, deleteADrink} = this;
       return (
            <div>
    
        <h1>Cocktail Chooser</h1>
              <main>
                <section>
                  <h2>Occasions</h2> 
                  <Occasions occasions={occasions}/>
                </section>
                <section>
                 <h2>Drinks</h2>
                 <button onClick={createADrink}>Create A Drink</button>
                 <Drinks drinks={drinks} deleteADrink={deleteADrink}/>
                </section>
              </main>
            </div>
          );
            
    


//         return React.createElement('div',
//         null,
//         React.createElement('h1', null, 'Cocktail Chooser React'),
//         React.createElement('main', null,
//         React.createElement('section',
//         null, 
//         React.createElement('h2', null, 'Occasions'),
//         React.createElement('ul', null,
//         occasions.map(occasion => {
//             return React.createElement('li', {key: occasion.id}, occasion.name)
//         })
//         )
//         ),
//         React.createElement('section',
//         null, 
//         React.createElement('h2', null, 'Drinks'),
//         React.createElement('ul', 
//         null,
//         drinks.map( drink => {
//             return React.createElement('li', {key: drink.id}, drink.name)
//         }))
//         )
//         )
//         );
            }
        }

const root = document.querySelector('#root');
ReactDOM.render(
 <App />,
  root  
);
