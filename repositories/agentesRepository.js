const { v4: uuidv4 } = require('uuid');
const agentes = [
    {
        "id": "401bccf5-cf9e-489d-8412-446cd169a0f1",
        "nome": "Rommel Carneiro",
        "dataDeIncorporacao": "1992/10/04",
        "cargo": "delegado"
    },
    {
        "id": "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
        "nome": "Maria Oliveira",
        "dataDeIncorporacao": "1995/05/12",
        "cargo": "delegada"
    }
];

const criarAgente = (nome, dataDeIncorporacao, cargo) => {
    const novoAgente = {
        "id": uuidv4(),
        "nome": nome,
        "dataDeIncorporacao": dataDeIncorporacao,
        "cargo": cargo
    };

    agentes.push(novoAgente);
    return novoAgente;
}

const findAll = () => {
    return agentes;
}

const findById = (id) => {
    return agentes.find(agente => agente.id === id);
}

const atualizarAgente = (id, nome, dataDeIncorporacao, cargo) => {
    const agente = findById(id);
    if (!agente) {
        return null;
    }
    agente.nome = nome;
    agente.dataDeIncorporacao = dataDeIncorporacao;
    agente.cargo = cargo;
    agentes[agentes.indexOf(agente)] = agente;
    return agente;
}

const deletarAgente = (id) => {
    const agenteIndex = agentes.findIndex(agente => agente.id === id);
    if (agenteIndex === -1) {
        return null;
    }
    agentes.splice(agenteIndex, 1);
    return true;
}

module.exports = {
    findAll,
    criarAgente,
    findById,
    atualizarAgente,
    deletarAgente
}
