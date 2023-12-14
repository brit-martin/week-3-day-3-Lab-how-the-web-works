import express from 'express';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import session from 'express-session';
import users from './users.json' assert { type: 'json' };
import stuffedAnimalData from './stuffed-animal-data.json' assert { type: 'json' };

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

function getAnimalDetails(animalId) {
  return stuffedAnimalData[animalId];
}

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/all-animals', (req, res) => {
  res.render('all-animals.html.njk', { animals: Object.values(stuffedAnimalData) });
});

app.get('/animal-details/:animalId', (req, res) => {
  res.render('animal-details.html.njk', { animal: getAnimalDetails(req.params.animalId)});
});

app.get('/add-to-cart/:animalId', (req, res) => {
  let animalName = req.params.animalId
  if (req.session.cart){
    if (req.session.cart[animalName]) {
      req.session.cart[animalName]++
    }  else {
    req.session.cart[animalName] = 1
   }
  
} else {
  req.session.cart = {}
  req.session.cart[animalName] = 1
}
  // - check if the desired animal id is in the cart, and if not, put it in
  // - increment the count for that animal id by 1
  console.log(req.session.cart)
  res.redirect('/cart')
  // - redirect the user to the cart page
 
});



app.get('/cart', (req, res) => {
  // TODO: Display the contents of the shopping cart.

  // The logic here will be something like:

  // - get the cart object from the session
  let cart = req.session.cart 
  // - create an array to hold the animals in the cart, and a variable to hold the total
  let animalsArray = [];
  let orderTotal = 0

  for (let animal in cart){
    animalsArray.push()
  
  // cost of the order
  // - loop over the cart object, and for each animal id:
  //   - get the animal object by calling getAnimalDetails
  let currentAnimalDetails = getAnimalDetails(animal)

  //   - compute the total cost for that type of animal
    let currentAnimalTotalCost = cart[animal] * currentAnimalDetails.price // cost = quantity * price per item

  //   - add this to the order total
  orderTotal = orderTotal + currentAnimalTotalCost

  //   - add quantity and total cost as properties on the animal object
  currentAnimalDetails.subtotal = currentAnimalTotalCost
  currentAnimalDetails.quantity = cart[animal]
  //   - add the animal object to the array created above

  animalsArray.push(currentAnimalDetails)
  }

  // - pass the total order cost and the array of animal objects to the template
  
  // Make sure your function can also handle the case where no cart has
  // been added to the session

  res.render('cart.html.njk', {animals: animalsArray, orderTotal : orderTotal});
});

app.get('/checkout', (req, res) => {
  // Empty the cart.
  req.session.cart = {};
  res.redirect('/all-animals');
});

app.get('/login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.post('/process-login', (req, res) => {
  // TODO: Implement this
  res.send('Login has not been implemented yet!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
