const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database : 'tarea'
});

//Conectarnos a la base de datos
connection.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send("Bienvenido a la API de Lizbeth Ruelas Gallardo");
});

app.get('/perros', (req, res) => {
  //Consultar los tipos de perros
  connection.query('SELECT * FROM perros', function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
    }
    //Regresar un objeto json con el listado de los perros.
    res.status(200).json(results);
  });
});


app.get('/perros/:id', (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) {
    res.status(400).json({ error: 'parametros no validos.'});
    return;
  }
  //Consultar los perros
  connection.query(`SELECT * FROM perros WHERE id=?`, [id] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    if(results.length === 0) {
      res.status(404).json({ error: 'tipo de perro no existente.'});
      return;
    }
    //Regresar un objeto json con el listado de los tipos de perros.
    res.status(200).json(results);
  });
});

app.post('/perros', (req, res) => {
  console.log("req", req.body);
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const pelo = req.body.pelo;
  connection.query(`INSERT INTO perros (nombre, descripcion, pelo) VALUES (?,?,?)`, [nombre, descripcion, pelo] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});