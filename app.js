const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const loggerMorgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const Sentry = require("@sentry/node");
const xmlparser = require("express-xml-bodyparser");
const compression = require('compression')
const {fileUploadApp, ratelimitr, redirectURL, tokenApp, debugSentry, errorDisplay, errorHandle, validadeTokenApp, cacheRedis, timeoutApp, responseIndex} = require('./helpers/middlewares')


// Importe de rotas
const apetiteRouter = require("./routes/apetite_ao_risco");
const apresentacaoClienteRouter = require("./routes/apresentacao_cliente");
const categoriaAoRistRouter = require("./routes/categoria_de_risco");
const clientesRouter = require("./routes/clientes");
const colaboradoresDeConsentimentoRouter = require("./routes/colaboradores_de_consentimento");
const departamentoClientesRouter = require("./routes/departamentos_clientes");
const frameworksRouter = require("./routes/frameworks");
const industriasPrincipaisRouter = require("./routes/industrias_principais");
const jurisdicaoRouter = require("./routes/jurisdicao_activa");
const listaDeCategoriasRouter = require("./routes/lista_de_categoria_de_risco");
const listaCategoriaSubAoRistRouter = require("./routes/lista_categoria_sub_de_risco");
const escalaMatrizRouter = require("./routes/escala_matriz");
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
app.use(ratelimitr);
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
app.use("/v1/appetite-for-risk", apetiteRouter);
app.use("/v1/client-presentation", apresentacaoClienteRouter);
app.use("/v1/risk-category", categoriaAoRistRouter);
app.use("/v1/customers", clientesRouter);
app.use("/v1/consent-gatherers", colaboradoresDeConsentimentoRouter);
app.use("/v1/customer-departments", departamentoClientesRouter);
app.use("/v1/frameworks", frameworksRouter);
app.use("/v1/main-industries", industriasPrincipaisRouter)
app.use("/v1/active-jurisdiction", jurisdicaoRouter)
app.use("/v1/risk-category-list", listaDeCategoriasRouter);
app.use("/v1/list-sub-category-at-risk", listaCategoriaSubAoRistRouter);
app.use("/v1/risk-matrix", escalaMatrizRouter);
app.use("/v1/questions-categories", perguntasCategoriasRouter);
app.use("/v1/answers-questions-categories", respostasPerguntasCategoriasRouter);
app.use("/v1/risks", riscosRouter)
app.use("/v1/users", usuariosRouter)
app.use("/v1/users-functions", usuariosFuncoesRouter)

app.use(timeoutApp); 

// manipulador de erros do Sentry para produção
app.use(Sentry.Handlers.errorHandler());

// capturar 404 e encaminhar para o manipulador de erros
app.use(errorHandle);

// manipulador de erros
app.use(errorDisplay);


module.exports = app;