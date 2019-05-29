const express = require('express');
const router = express.Router();
const brain = require('../node_modules/brain.js/dist/index').default;
const fs = require('fs');
const net = new brain.recurrent.LSTM();

treinarRedeNeural();

router.get('/', (req, res, next) => {
  const frase = 'Estou muito feliz!';

  executarRedeNeural(frase).then((resultadoRedeNeural) => {
    res.render('index', { title: 'Express', frase: frase, sentimento: resultadoRedeNeural });
  })
});

router.post('/', (req, res, next) => {
  const frase = req.body.frase;

  executarRedeNeural(frase).then((resultadoRedeNeural) =>{
    res.render('index', { title: 'POST', frase: frase, sentimento: resultadoRedeNeural });
  });
});

function lerFrases() {
  return new Promise((resolve) => {
    fs.open('libs/frases.json', 'r', (err, arquivo) => {
      if (err) throw err;
      else {
        fs.readFile(arquivo, (err, buffer) => {
          if (err) throw err;
          else {
            resolve(JSON.parse(buffer.toString('utf-8')));
            fs.closeSync(arquivo);
          }
        });
      }
    });
  });
}

function treinarRedeNeural() {
  const treinos = [];

  lerFrases().then((frases) => {
    frases.forEach((f) => {
      treinos.push({ input: f.frase, output: f.sentimento });
    });

    net.train(treinos, { iterations: 100 });
  });
}

function executarRedeNeural(frase) {
  return new Promise((resolve) =>{
    resolve(net.run(frase));
  });
}

module.exports = router;
