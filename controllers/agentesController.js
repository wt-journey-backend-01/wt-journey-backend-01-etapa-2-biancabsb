const agentesRepository = require('../repositories/agentesRepository');
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getAllAgentes = (req, res, next) => {
    try {
        const agentes = agentesRepository.findAll();
        res.status(200).json(agentes);
    } catch (error) {
        next(error);
    }
};

const getAgenteById = (req, res, next) => {
    const { id } = req.params;
    try {
        const agente = agentesRepository.findById(id);
        if (!agente) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }
        res.status(200).json(agente);
    } catch (error) {
        next(error);
    }
};

const createAgente = (req, res, next) => {
    try {
        const { nome, cargo, dataDeIncorporacao } = req.body;
        if (!nome || !cargo || !dataDeIncorporacao) {
            next(new APIError("Todos os campos são obrigatórios", 400));
            return;
        }
        const novoAgente = agentesRepository.criarAgente(nome, cargo, dataDeIncorporacao);
        res.status(201).json(novoAgente);
    } catch (error) {
        next(error);
    }
};

const updateAgente = (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, cargo, dataDeIncorporacao } = req.body;
        if (!nome || !cargo || !dataDeIncorporacao) {
            next(new APIError("Todos os campos são obrigatórios", 400));
            return;
        }
        const agenteAtualizado = agentesRepository.atualizarAgente(id, nome, cargo, dataDeIncorporacao);
        if (!agenteAtualizado) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
};
const updateAgentePartial = (req, res, next) => {
    const { id } = req.params;
    const { nome, cargo, dataDeIncorporacao } = req.body;
    try {
        const agenteAtualizado = agentesRepository.atualizarAgente(id, nome, cargo, dataDeIncorporacao);
        if (!agenteAtualizado) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
};

const deleteAgente = (req, res, next) => {
    const { id } = req.params;
    try {
        const resultado = agentesRepository.deletarAgente(id);
        if (!resultado) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    updateAgentePartial,
    deleteAgente
};