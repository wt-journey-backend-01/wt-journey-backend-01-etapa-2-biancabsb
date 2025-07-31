const ocorrenciasRepository = require('../repositories/casosRepository');
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getAllCasos = (req, res, next) => {
    try {
        const casos = ocorrenciasRepository.findAll();
        res.status(200).json(casos);
    } catch (error) {
        next(error);
    }
};
const getCasoById = (req, res, next) => {
    const { id } = req.params;
    try {
        const caso = ocorrenciasRepository.findById(id);
        if (!caso) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }
        res.status(200).json(caso);
    } catch (error) {
        next(error);
    }
};
const createCaso = (req, res, next) => {
    try {
        const { titulo, descricao, status, agente_id } = req.body;
        if (!titulo || !descricao || !status || !agente_id) {
            next(new APIError("Todos os campos são obrigatórios", 400));
            return;
        }
        if (!["aberto", "solucionado"].includes(status)) {
            next(new APIError("Status inválido", 400));
            return;
        }
        const novoCaso = ocorrenciasRepository.criarCaso(titulo, descricao, status, agente_id);
        res.status(201).json(novoCaso);
    } catch (error) {
        next(error);
    }
};
const updateCaso = (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, status, agente_id } = req.body;
        if (!titulo || !descricao || !status || !agente_id) {
            next(new APIError("Todos os campos são obrigatórios", 400));
            return;
        }
        if (!["aberto", "solucionado"].includes(status)) {
            next(new APIError("Status inválido", 400));
            return;
        }
        const casoAtualizado = ocorrenciasRepository.atualizarCaso(id, titulo, descricao, status, agente_id);
        if (!casoAtualizado) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }
        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
};
const updateCasoPartial = (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, status, agente_id } = req.body;
        const casoAtualizado = ocorrenciasRepository.atualizarCaso(id, titulo, descricao, status, agente_id);
        if (!casoAtualizado) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }
        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
};

const deleteCaso = (req, res, next) => {
    const { id } = req.params;
    try {
        const resultado = ocorrenciasRepository.deletarCaso(id);
        if (!resultado) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    updateCasoPartial,
    deleteCaso
};