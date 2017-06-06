var express = require('express');
var router = express.Router();
var pg = require('pg');

// DB config
var config = {
  user: 'Guest', //env var: PGUSER
  database: 'node_recipe_book', //env var: PGDATABASE
  password: '123456', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

/* GET home page. */
router.get('/', function (req, res, next) {


  //ask for a client from the pool
  pg.connect(config, function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('SELECT * FROM recipes', function (err, result) {

      if (err) {
        return console.error('error running query', err);
      }
      done(err);
      res.render('index', {
        title: 'Recipes',
        recipes: result.rows
      });
    });
  });

});

router.post('/add', function (req, res) {
  pg.connect(config, function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)", [
      req.body.name, req.body.ingredients, req.body.directions
    ], function (err, success) {
      if (err) {
        return console.error('error excecuting insert query', err);
      }
      done(err);
      res.redirect('/');
    });

  });
});

router.delete('/delete/:id', function (req, res) {
  pg.connect(config, function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("DELETE FROM recipes WHERE id = $1", [
      req.params.id
    ],  function(err, success){
      if (err) {
        return console.error('error excecuting insert query', err);
      }
      done(err);
      res.send(200);
    });
  });
});

module.exports = router;
