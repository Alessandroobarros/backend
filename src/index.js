const express = require('express')                                                      // Chamou o express
const { uuid, isUuid } = require('uuidv4')                                              // Importa a função uuid para criação de id universal e isUuid para verificar se o id é valido
const cors = require('cors');                                                           //Importa o cors

const app = express();                                                                  // atribuiou o express a variavel app

app.use(cors());                                                                        //Permite que qualquer frontend tenha acesso ao nosso backend
app.use(express.json())

/**
 * Métodos HTTP:
 * 
 * GET: Usado para busacar informações do back-end.
 * POST: Criar uma inforação no back-end.
 * PUT/PATCH: Alterar uma informação no back-end.
 * DELETE: Deletar informação no back-end
 */

/**
 * Tipos de parâmetros
 * 
 * Query Params: Utilizados para filtros e paginação.
 * Route Params: Identificar recursos (Atualizar/deletar)
 * Request Body: Usado para definir o conteudo na hora de criar ou editar um recurso.
 */

/**
 * Middleware: é um interceptador de requisições
 * pode interromper totalmente a requisição.
 * pode alterar dados da requisição.
 * 
 */

const projects = [];                                                                        //Array para armazenar os proejetos (Nunca usar esse modelo em produção !)

function logRequest(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;                                    //Variavel que recebe o metodo e a url.

    console.time(logLabel);                                                                  //Ira mostrar no console quais os methodos que estao sendo chamados.

    next();                                                                          //Retorno para executar o róximo middleware(todas as requisições são middleware);

    console.timeEnd(logLabel);    
}

function validateProjectId(request, response, next){                                        //Função para validar o id informado.
    const { id } = request.params;                                                          //Recebe o id.

    if(!isUuid(id)){                                                                        //Se o id for diferente do tipo uuid retorna erro.
        return response.status(400).json({error:' Invalid project Id'});
    }

    return next()                                                                           //Se não executa o proximo middleware(rota) normalmente
}

app.use(logRequest);                                                                         //Para que express utilize o Middleware.
app.use('/projects/:id', validateProjectId);                                                 //Permite que o express use a função de validar id apenas nas rotas que recebam id como parametro

app.get('/projects', (request, response) => {                                                //Define a rota localhost:3333/projects para receber dados
    const {title} = request.query;                                                           //variavel para capturar os valores dos parametros informados no query

    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;
    
    return response.json(results);                                                          //Lista os projetos armazenados na variavel projects
});

app.post('/projects', (request, response) => {                                               //Define a rota localhost:3333/projects para postar projetos
    const { title, owner } = request.body;                                                  //variavel para capturar os valores dos parametros informados no body da requisição

    const project = { id: uuid(), title, owner };                                           //variavel que gera um id unico e mostra o valor das variaveis informadas no body
    projects.push(project)                                                                  //Adiciona o projeto novo no final do Array de projetos.

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {                                            //Define a rota localhost:3333
    const { id } = request.params;                                                          //variavel para capturar o valor informado como parametro no id requisição
    const { title, owner } = request.body;                                                  //variavel para capturar os valores dos parametros informados no body da requisição

    const projectIndex = projects.findIndex(project => project.id === id);                  //Variavel que percorre o Array e verifica qual é o indicie do projeto que recebe o id igual ao id passado por parametro

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {                                         //Define a rota localhost:3333
    const { id } = request.params;                                                           //variavel para capturar o valor informado como parametro no id requisição

    const projectIndex = projects.findIndex(project => project.id === id);                   //Variavel que percorre o Array e verifica qual é o indicie do projeto que recebe o id igual ao id passado por parametro

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' })
    }

    projects.splice(projectIndex, 1)
    return response.status(204).send();
});

app.listen(3333, () => {                                                                      //Inicia o servidor na porta 3333
    console.log("🚀 Back-end started!🚀")                                                    //Mostra no console a mensagem de Back-end started
});
