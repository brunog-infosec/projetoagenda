const mongoose = require("mongoose"); //importação do modulo do mongoose
const validator = require("validator");
const bcryptjs = require("bcryptjs");

//Criando o esquema no Banco de Dados
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true }, //campo obrigatório para ser enviado
  password: { type: String, required: true }, //campo obrigatório para ser enviado
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({
      email: this.body.email,
    });
    //verifica usuário existe
    if (!this.user) {
      this.errors.push("Usuário ou senha inválido");
      return;
    }
    //verifica se a senha está correta
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Senha inválida");
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;
    await this.userExists(); //verifica se usuário ja existe na BD
    if (this.errors.length > 0) return; //Verifica novamente se houve algum erro

    const salt = bcryptjs.genSaltSync(); //Gera uma sincronização do salto da hash
    this.body.password = bcryptjs.hashSync(this.body.password, salt); // Gera a senha hash com o salto

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({
      email: this.body.email,
    });
    if (this.user) this.errors.push("Usuário já existe");
  }

  valida() {
    this.cleanUp();
    //Email precisa ser valido
    if (!validator.isEmail(this.body.email))
      this.errors.push("E-mail inválido");

    //Senha precisa ter entre 6 e 50 caracteres
    if (this.body.password.length < 6 || this.body.password.length > 50) {
      this.errors.push("A senha precisa ter entre 6 e 50 caracteres");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
