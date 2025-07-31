const { v4: uuidv4 } = require('uuid');
const casos = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"

    },
]

const criarCaso = (titulo, descricao, status, agente_id) => {
    const novoCaso = {
        id: uuidv4(),
        titulo,
        descricao,
        status,
        agente_id
    };

    casos.push(novoCaso);
    return novoCaso;
}
const findAll = () => {
    return casos;
}
const findById = (id) => {
    return casos.find(caso => caso.id === id);
}

const atualizarCaso = (id, titulo, descricao, status, agente_id) => {
    const caso = findById(id);
    if (!caso) {
        return null;
    }
    caso.titulo = titulo;
    caso.descricao = descricao;
    caso.status = status;
    caso.agente_id = agente_id;

    return caso;
}
const deletarCaso = (id) => {
    const casoIndex = casos.findIndex(caso => caso.id === id);
    if (casoIndex === -1) {
        return null;
    }
    casos.splice(casoIndex, 1);
    return true;
}

module.exports = {
    findAll,
    criarCaso,
    findById,
    atualizarCaso,
    deletarCaso
}
