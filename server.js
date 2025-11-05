require("dotenv").config(); //Variaveis de ambiente
const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Conexão com Banco de dados

mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log("conectei na base de dados");
    app.emit("pronto"); //Emitir um sinal de conexão
  })
  .catch((e) => {
    console.log(e);
  });

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const routes = require("./routes"); //rotas da app
const path = require("path"); //caminhos 
const helmet = require("helmet"); // verifica headers para deixar app mais segura
const csrf = require("csurf"); //cria tokens para formulários

const {
  middlewareGlobal,
  outroMiddleware,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware"); // Importação do middleware

// app.use(helmet());

app.use(express.urlencoded({ extended: true })); // tratamento do body das requisições pelo node expresss é obrigatório utilizar essa função
app.use(express.json()); // Fazer o parse de JSON para dentro da aplicação
app.use(express.static(path.resolve(__dirname, "public"))); //Referenciando o caminho do static pages que podem ser acessador, img, css, js

const sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());

//caminhos das views engines
app.set("views", path.resolve(__dirname, "src", "views")); // Configuração do Caminho da pasta views
app.set("view engine", "ejs"); // Configuração da engine que será utilizada para views

app.use(csrf());
//Nossos próprios Middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
// app.use(outroMiddleware);

// Use do express Router
app.use(routes);

// Fazendo o servidor ficar ouvindo a porta http
// Aguarda o sinal da conexão com banco de dados pra depois escutar a porta
app.on("pronto", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Acessar http://localhost:${process.env.PORT}`);
    console.log(`Servidor executando na porta ${process.env.PORT}`);
  });
});
