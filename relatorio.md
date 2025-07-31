<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 9 créditos restantes para usar o sistema de feedback AI.

# Feedback para biancabsb:

Nota final: **64.0/100**

Olá, biancabsb! 👋✨

Primeiramente, parabéns pelo esforço e dedicação em construir essa API para o Departamento de Polícia! 🎉 Você já conseguiu implementar uma estrutura muito boa, com rotas, controllers e repositories organizados, e isso é fundamental para projetos escaláveis e fáceis de manter. Além disso, vi que várias funcionalidades essenciais estão funcionando, como listagem, busca por ID, criação e deleção tanto de agentes quanto de casos. Isso mostra que você entendeu o fluxo básico do Express.js e como trabalhar com dados em memória. Muito bom! 👏🚀

---

## Vamos juntos analisar alguns pontos importantes para você evoluir ainda mais? 🕵️‍♂️🔎

### 1. Organização da Estrutura de Diretórios

Sua estrutura está muito próxima do esperado e isso é ótimo! 👏 Porém, reparei que seu arquivo `docs/swagger.json` está correto, mas na estrutura esperada o arquivo é chamado `swagger.js` (não um problema grave, só para ficar atento à padronização). Fora isso, os diretórios `routes`, `controllers`, `repositories` e `utils` estão todos presentes e organizados, o que é um ponto forte seu!

---

### 2. Problemas Fundamentais com o Repositório de Agentes

Ao analisar o arquivo `repositories/agentesRepository.js`, encontrei um problema sutil, mas que impacta diretamente as operações de criação e atualização de agentes:

```js
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
```

O problema aqui é a **ordem dos parâmetros** da função `criarAgente`. Você declarou `(nome, dataDeIncorporacao, cargo)`, mas no `agentesController.js` você está chamando assim:

```js
const novoAgente = agentesRepository.criarAgente(nome, cargo, dataDeIncorporacao);
```

Ou seja, você está passando `cargo` onde deveria passar `dataDeIncorporacao` e vice-versa. Isso causa uma troca de valores que pode levar a dados incorretos nos agentes criados e atualizados, e provavelmente é a raiz de falhas em testes de criação e atualização.

**Como corrigir?** Ajuste a assinatura da função para:

```js
const criarAgente = (nome, cargo, dataDeIncorporacao) => {
    const novoAgente = {
        id: uuidv4(),
        nome,
        cargo,
        dataDeIncorporacao
    };

    agentes.push(novoAgente);
    return novoAgente;
}
```

Essa pequena mudança vai garantir que os dados estejam no lugar certo e que os agentes sejam criados e atualizados corretamente! 💡

---

### 3. Validação da Data de Incorporação

Percebi que, atualmente, você só valida se os campos estão presentes, mas não valida o formato da data nem se ela está no futuro. Isso permite registros com datas inválidas, como datas no futuro ou formatos errados, o que não é desejado.

Exemplo no seu `agentesController.js`:

```js
if (!nome || !cargo || !dataDeIncorporacao) {
    next(new APIError("Todos os campos são obrigatórios", 400));
    return;
}
```

**O que falta aqui?** Uma validação mais robusta para garantir que `dataDeIncorporacao` esteja no formato `YYYY-MM-DD` e que não seja uma data futura.

Você pode usar uma função simples assim:

```js
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if(!regex.test(dateString)) return false;
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return false;
    const today = new Date();
    if(date > today) return false;
    return true;
}
```

E depois, no seu controller:

```js
if (!isValidDate(dataDeIncorporacao)) {
    next(new APIError("Data de incorporação inválida ou futura", 400));
    return;
}
```

Essa validação vai evitar que agentes sejam criados ou atualizados com datas erradas, garantindo mais integridade nos seus dados! 📅✅

Para entender melhor sobre validação de dados e tratamento de erros, recomendo fortemente este vídeo:  
▶️ [Validação de dados em APIs Node.js/Express](https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_)

---

### 4. Proteção do Campo `id` nas Atualizações

Outro ponto importante: percebi que em seus endpoints de atualização (tanto PUT quanto PATCH) para agentes e casos, não há proteção para evitar que o campo `id` seja alterado.

Por exemplo, no `agentesController.js`:

```js
const updateAgente = (req, res, next) => {
    const { id } = req.params;
    const { nome, cargo, dataDeIncorporacao } = req.body;
    // ... atualiza agente ...
}
```

Mas se alguém enviar no corpo da requisição um campo `id` diferente, seu código vai ignorar isso? Ou o `id` será atualizado?

No seu `repositories/agentesRepository.js`, você atualiza os campos diretamente:

```js
agente.nome = nome;
agente.dataDeIncorporacao = dataDeIncorporacao;
agente.cargo = cargo;
```

Mas não trata o `id` — o que é ótimo. Porém, no controller, você não está impedindo que o usuário envie um `id` no corpo. O ideal é que você ignore ou rejeite essa tentativa, pois o `id` é chave única e imutável.

**Sugestão:** Antes de atualizar, verifique se o `id` está presente no corpo e retorne erro 400:

```js
if (req.body.id && req.body.id !== id) {
    next(new APIError("Não é permitido alterar o ID do agente", 400));
    return;
}
```

Esse cuidado evita inconsistências e mantém a integridade do seu banco em memória.

---

### 5. Validação de Agente Existente ao Criar Caso

No seu `casosController.js`, quando você cria um novo caso, você não está validando se o `agente_id` passado realmente existe no repositório de agentes.

Veja:

```js
const novoCaso = ocorrenciasRepository.criarCaso(titulo, descricao, status, agente_id);
```

Antes disso, seria importante fazer algo como:

```js
const agenteExiste = agentesRepository.findById(agente_id);
if (!agenteExiste) {
    next(new APIError("Agente não encontrado para o caso", 404));
    return;
}
```

Sem essa validação, seu sistema aceita casos vinculados a agentes inexistentes, o que pode gerar dados inconsistentes e confusos.

---

### 6. Validação do Campo `status` no Caso

Você já fez uma boa validação para o campo `status` dos casos, restringindo para `"aberto"` e `"solucionado"`. Isso é ótimo! 👍 Continue assim para garantir que os dados estejam sempre dentro do esperado.

---

### 7. Validação Parcial de Atualização (PATCH)

Nas funções de atualização parcial (`updateAgentePartial` e `updateCasoPartial`), você está chamando a mesma função de atualização completa, passando todos os campos, mesmo que o corpo da requisição tenha apenas alguns deles.

Por exemplo, em `agentesController.js`:

```js
const updateAgentePartial = (req, res, next) => {
    const { id } = req.params;
    const { nome, cargo, dataDeIncorporacao } = req.body;
    const agenteAtualizado = agentesRepository.atualizarAgente(id, nome, cargo, dataDeIncorporacao);
    // ...
};
```

Se o cliente enviar só `nome`, os outros campos ficarão `undefined` e podem sobrescrever os dados existentes com valores inválidos.

**Solução:** Implemente uma função específica para atualização parcial que atualize apenas os campos presentes no corpo da requisição, por exemplo:

```js
const atualizarAgenteParcial = (id, dadosParciais) => {
    const agente = findById(id);
    if (!agente) return null;

    if (dadosParciais.nome !== undefined) agente.nome = dadosParciais.nome;
    if (dadosParciais.cargo !== undefined) agente.cargo = dadosParciais.cargo;
    if (dadosParciais.dataDeIncorporacao !== undefined) agente.dataDeIncorporacao = dadosParciais.dataDeIncorporacao;

    return agente;
}
```

E no controller:

```js
const updateAgentePartial = (req, res, next) => {
    const { id } = req.params;
    const dadosParciais = req.body;

    if (dadosParciais.id) {
        next(new APIError("Não é permitido alterar o ID do agente", 400));
        return;
    }

    const agenteAtualizado = agentesRepository.atualizarAgenteParcial(id, dadosParciais);
    if (!agenteAtualizado) {
        next(new APIError("Agente não encontrado", 404));
        return;
    }
    res.status(200).json(agenteAtualizado);
};
```

Isso evita sobrescrever campos com `undefined` e melhora a confiabilidade da sua API.

---

### 8. Bônus: Parabéns pelas Implementações Extras!

Mesmo que os testes bônus não tenham passado, vi que você tentou implementar filtros e ordenações, além de mensagens de erro customizadas. Isso mostra que você está se esforçando para ir além do básico e entregar uma API mais completa e amigável! 👏 Continue nessa pegada que você vai longe! 🚀

---

## Recursos que Recomendo para Você Aprofundar:

- Para entender melhor a arquitetura MVC e organização de rotas/controllers/repositories:  
▶️ https://youtu.be/bGN_xNc4A1k?si=Nj38J_8RpgsdQ-QH

- Para validar dados e tratar erros HTTP corretamente:  
▶️ https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_  
▶️ https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/400  
▶️ https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/404

- Para manipular arrays e objetos de forma eficiente (útil para atualização parcial):  
▶️ https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI

---

## Resumo Rápido dos Principais Pontos para Focar:

- 🔄 Corrigir a ordem dos parâmetros na função `criarAgente` para `(nome, cargo, dataDeIncorporacao)`  
- 📅 Implementar validação do formato e validade da data de incorporação (não aceitar datas futuras)  
- 🛡️ Proteger o campo `id` para que não possa ser alterado em atualizações (PUT e PATCH)  
- 🔍 Validar se o `agente_id` passado ao criar um caso realmente existe no repositório de agentes  
- ⚠️ Implementar atualização parcial correta, atualizando somente os campos enviados no PATCH, evitando sobrescrever com `undefined`  
- 🌟 Continuar explorando filtros, ordenações e mensagens de erro customizadas para aprimorar sua API  

---

biancabsb, você está no caminho certo e já tem uma base muito sólida! 💪 Com esses ajustes, sua API vai ficar ainda mais robusta e confiável. Continue praticando, pois cada detalhe que você aprimora é um grande passo para se tornar um(a) expert em Node.js e Express! 🚀✨

Se precisar de ajuda para implementar qualquer um desses pontos, estou aqui para te apoiar! Vamos juntos nessa jornada! 💙

Um abraço de Code Buddy! 🤖💻👊

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>