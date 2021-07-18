const router = require('express').Router();
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

// set up all get and post routes at /api/pizzas
router
    .route('/')
    .get(getAllPizza)
    .post(createPizza);

// set up all get one delete and put routes at /api/pizzas:id
router
    .route('/:id')
    .get(getPizzaById)
    .put(updatePizza)
    .delete(deletePizza);

module.exports = router;