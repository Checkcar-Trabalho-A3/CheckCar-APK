### 📘 Documentação – Aplicativo de Checklist de Veículos

## 📱 Visão Geral
O aplicativo CheckCar é uma solução mobile desenvolvida em React Native com backend em Spring Boot. Ele permite que usuários logados realizem checklists de veículos (carro, moto, caminhão), registrando respostas para perguntas pré-definidas e enviando os resultados para o servidor.

## ⚙️ Tecnologias Utilizadas
- Frontend (Mobile): React Native, Expo, Google Fonts, Fetch API

- Backend (API): Spring Boot, Hibernate, JPA, PostgreSQL/MySQL

- Comunicação: REST API (JSON)

- Autenticação: Login simples com envio de usuarioId

## 🔑 Fluxo de Uso
- Login

- Usuário realiza login e recebe seu usuarioId.

- Esse ID é repassado para as próximas telas.

- Menu Checklist

- Usuário escolhe o tipo de checklist (Carro, Moto, Caminhão).

- Digita a placa do veículo.

- O app consulta o backend (/api/veiculos/placa/{placa}) e retorna o veiculoId.

- Navega para a tela de checklist com parâmetros: usuarioId, veiculoId, tipo, placa.

- Checklist

- Perguntas são carregadas do backend (/api/perguntas?tipoVeiculo=CARRO).

- Usuário responde com opções (OK, NOK, NA) e observações.

- Ao clicar em Enviar, o app monta um payload JSON e envia para /api/respostas-checklist/lote.

- Backend

- Recebe os dados via DTO (RespostaChecklistDTO).

- Converte IDs em entidades (Usuario, Veiculo, PerguntaCheckList).

- Gera automaticamente um idLote (UUID) para agrupar todas as respostas.

- Salva no banco via RespostaChecklistRepository.

## 📂 Estrutura das APIs
### 🔹 Veículos
`GET /api/veiculos/placa/{placa} Retorna dados do veículo pelo número da placa.`

### 🔹 Perguntas
`GET /api/perguntas?tipoVeiculo={tipo} Retorna lista de perguntas ativas para o tipo de veículo.`

### 🔹 Respostas
`POST /api/respostas-checklist/lote Recebe um lote de respostas e salva no banco. Payload esperado (DTO):`

```json
[
  {
    "idUsuario": 1,
    "idVeiculo": 2,
    "tipo": "CARRO",
    "idPergunta": 3,
    "observacao": "Tudo funcionando",
    "status": "OK"
  }
]
```

## 🗄️ Estrutura das Entidades
- Usuario
id

- nome

email

- Veiculo
id

- placa

- marca

-  modelo

- ano

- tipo

- PerguntaCheckList
id

- texto

- tipoResposta (SELECAO ou TEXTO)

- tipoVeiculo

- ativo

- RespostaChecklist
id

- idLote (UUID)

- usuario (ManyToOne)

- veiculo (ManyToOne)

- pergunta (ManyToOne)

- tipo

- observacao

- status

## 🚀 Instalação e Execução

- ## Frontend

### Instalar dependências
```bash
npm install
```

### Rodar em modo desenvolvimento
```bash
expo start
```
### Gerar APK
```bash
expo build:android
````
- ## Backend

### Rodar aplicação Spring Boot
```bash
mvn spring-boot:run
```
## ✅ Considerações finais
- O idLote é gerado automaticamente no backend como UUID, garantindo unicidade e agrupamento.

- O frontend envia apenas IDs e textos simples via DTO.

- O backend converte os IDs em entidades reais antes de salvar.

- O sistema está pronto para uso em produção com banco relacional e API REST.
