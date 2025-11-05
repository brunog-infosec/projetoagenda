const Contato = require('../models/ContatoModel')

exports.index = function (req, res) {
  res.render('contato', {
    objetoContato: {}
  });
};

//deletar
exports.delete = async function (req, res) {
  if (!req.params.id) return res.render('404');
  const objetoContato = new Contato(req.body)
  const contato = await objetoContato.delete(req.params.id);
  if (!contato) return res.render('404');

  req.flash('success', 'Contato deletado com sucesso.');
  req.session.save(() => res.redirect('/'));
  return;
}

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();
    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors)
      req.session.save(() => res.redirect('/contato/index'))
      return
    };

    req.flash('success', 'Seu Contato foi Criado com Sucesso!')
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
}

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render('404');
  const contato = new Contato(req.body);
  const objetoContato = await contato.buscaPorId(req.params.id);
  if (!objetoContato) return res.render('404');
  res.render('contato', { objetoContato });
}

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render('404');
    const contato = new Contato(req.body);
    await contato.edit(req.params.id)

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors)
      req.session.save(() => res.redirect('/contato/index'))
      return
    };

    req.flash('success', 'Seu Contato atualizado com Sucesso!')
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;

  } catch (e) {
    console.log(e)
    res.render('404')
  }

  




}