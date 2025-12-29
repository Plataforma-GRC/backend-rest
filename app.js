const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const loggerMorgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const Sentry = require("@sentry/node");
const xmlparser = require("express-xml-bodyparser");
const compression = require('compression')
const {fileUploadApp, rateLimiter, redirectURL, tokenApp, debugSentry, errorDisplay, errorHandle, validadeTokenApp, cacheRedis, timeoutApp, responseIndex} = require('./helpers/middlewares')


// Importe de rotas
const apetiteRouter = require("./routes/apetite_ao_risco");
const apresentacaoClienteRouter = require("./routes/apresentacao_cliente");
const categoriaAoRistRouter = require("./routes/categoria_de_risco");
const clientesRouter = require("./routes/clientes");
const colaboradoresDeConsentimentoRouter = require("./routes/colaboradores_de_consentimento");
const departamentoClientesRouter = require("./routes/departamentos_clientes");
const industriasPrincipaisRouter = require("./routes/industrias_principais");
const jurisdicaoRouter = require("./routes/jurisdicao_activa");
const listaDeCategoriasRouter = require("./routes/lista_de_categoria_de_risco");
const listaCategoriaSubAoRistRouter = require("./routes/lista_categoria_sub_de_risco");
const perguntasCategoriasRouter = require("./routes/perguntas_categorias");
const respostasPerguntasCategoriasRouter = require("./routes/respostas_perguntas_categorias");
const riscosRouter = require("./routes/riscos");
const usuariosRouter = require("./routes/usuarios");
const usuariosFuncoesRouter = require("./routes/usuarios_funcoes");

require("dotenv").config({ path: path.join(__dirname, '.env') });

const app = express(); 

Sentry.init({
  dsn: "https://35aac96209005871c0b0960ce2e3358d@o4508811616518144.ingest.de.sentry.io/4508811618811984",   
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(fileUploadApp);
app.use(rateLimiter);
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(loggerMorgan("dev"));
app.use(express.json({limit: '100mb'}));
app.use(cookieParser());
app.use("/v1/images", express.static(path.join(__dirname, "assets", "imgs")));
app.use(cors());
app.use(express.urlencoded({ extended: false })); 
app.use(compression());

// credencial de token

app.get("/", redirectURL);

// app.use("/", cacheRedis)

// token request
app.post('/v0/token-app', tokenApp)

app.get("/debug-sentry", debugSentry);


app.use(validadeTokenApp);

app.get("/v1/", responseIndex);
app.use("/v1/apetite-ao-risco", apetiteRouter);
app.use("/v1/apresentacao-cliente", apresentacaoClienteRouter);
app.use("/v1/categoria-ao-risco", categoriaAoRistRouter);
app.use("/v1/clientes", clientesRouter);
app.use("/v1/colaboradores-de-consentimentos", colaboradoresDeConsentimentoRouter);
app.use("/v1/departamentos-clientes", departamentoClientesRouter);
app.use("/v1/industrias-principais", industriasPrincipaisRouter)
app.use("/v1/jurisdicao-activa", jurisdicaoRouter)
app.use("/v1/lista-de-categoria-de-risco", listaDeCategoriasRouter);
app.use("/v1/lista-sub-categoria-ao-risco", listaCategoriaSubAoRistRouter);
app.use("/v1/perguntas-categorias", perguntasCategoriasRouter);
app.use("/v1/respostas-perguntas-categorias", respostasPerguntasCategoriasRouter);
app.use("/v1/riscos", riscosRouter)
app.use("/v1/usuarios", usuariosRouter)
app.use("/v1/usuarios-funcoes", usuariosFuncoesRouter)

app.use(timeoutApp); 

// manipulador de erros do Sentry para produção
app.use(Sentry.Handlers.errorHandler());

// capturar 404 e encaminhar para o manipulador de erros
app.use(errorHandle);

// manipulador de erros
app.use(errorDisplay);


module.exports = app;