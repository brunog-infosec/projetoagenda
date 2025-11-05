const mongoose = require("mongoose"); //importação do modulo do mongoose

//Criando o esquema no Banco de Dados
const HomeSchema = new mongoose.Schema({
  titulo: { type: String, required: true }, //campo obrigatório para ser enviado
  descricao: String,
});


class Home {

}

module.exports = Home;
