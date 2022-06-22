const Sequelize = require('sequelize');
const { STRING, ARRAY, FLOAT } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_db');

const syncAndSeed = async()=> {
  await conn.sync({ force: true });

  let drinks = [
 
    {  
      name: 'kamikaze'
    },
  
    {  
      name: 'cosmorita'
    },
  
    {  
      name: 'daiquiri'
    },  
  
    {  
      name: 'bluebird'
    },
  
    {  
      name: 'painkiller'
    }
  
  ];
  
  drinks = await Promise.all(drinks.map (drink => Drink.create(drink)));

  drinks = drinks.reduce( (acc, drink) => {
      acc[drink.name] = drink;
      return acc;
    }, {}); 

   let occasions = await Promise.all(['GirlsNightOut', 'Tgif', 'ThirstyThursdays',
'Its5oclockSomewhere'].map( name => Occasion.create({ name })));
  occasions = occasions.reduce( (acc, occasion) => {
    acc[occasion.name] = occasion;
    return acc;
  }, {});

  const results = await Promise.all([
    Result.create({ occasionId: occasions.GirlsNightOut.id, drinkId: drinks.cosmorita.id}),
    Result.create({ occasionId: occasions.Tgif.id, drinkId: drinks.kamikaze.id}),
    Result.create({ occasionId: occasions.ThirstyThursdays.id, drinkId: drinks.painkiller.id}),
    Result.create({ occasionId: occasions.Its5oclockSomewhere.id, drinkId: drinks.bluebird.id})

  ]);
  return {
    occasions,
    drinks,
    results
  };

};

const Occasion = conn.define('occasion', {
    name: {
      type: STRING
    }
  });
const Result = conn.define('result', {});
const Drink = conn.define('drink', {
  name: {
    type: STRING
  },
  location: {
    type: ARRAY(FLOAT),
    defaultValue: []
  }
});

Result.belongsTo(Occasion);
Result.belongsTo(Drink);

const express = require('express');
const app = express();
const path = require('path');


app.use(express.json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/occasions', async(req, res, next)=> {
  try {
    res.send(await Occasion.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/drinks', async(req, res, next)=> {
  try {
    res.status(201).send(await Drink.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/drinks', async(req, res, next)=> {
  try {
    res.send(await Drink.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/occasions/:occasionId/results', async(req, res, next)=> {
  try {
    res.send(await Result.findAll({ where: { occasionId: req.params.occasionId }}));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/occasions/:occasionId/results', async(req, res, next)=> {
  try {
    res.status(201).send(await Result.create({ occasionId: req.params.occasionId, drinkId: req.body.drinkId}));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/drinks/:id', async(req, res, next)=> {
  try {
    const drink = await Drink.findByPk(req.params.id);
    await drink.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/results/:id', async(req, res, next)=> {
  try {
    const result = await Result.findByPk(req.params.id);
    await result.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err.stack);
  res.status(500).send({ error: err.message });
});
const port = process.env.PORT || 3000;

const init = async()=> {
  await syncAndSeed();
  app.listen(port, ()=> console.log(`listening on port ${port}`));
}

init();