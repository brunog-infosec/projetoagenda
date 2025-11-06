const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
  const contato = new Contato(req.body);
  if (req.session.user) {
    const contatos = await contato.buscaContatos();
    res.render('index', { contatos }); // renderizar o index, e enviar o Array de objetos
  } else {
    res.render('login');
  }
  return;
};
