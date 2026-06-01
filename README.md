### 🚀 Entrega da Sprint 4: Modelo de Implementação da Solução
> **Trabalho Acadêmico Prático em Grupo — Faculdade PUC Minas**  
> Implementação do Back-End, Conexão com Banco de Dados e Integração Front-End.

Este projeto consiste na tela de **Produtos Comprados (Histórico de Pedidos)** com **CRUD completo operante**, conectando a interface front-end a um banco de dados **MySQL hospedado na nuvem** por meio de um back-end estruturado e 100% aderente aos critérios de avaliação da **Sprint 4**.

---

## 📂 Organização dos Recursos do Projeto
Seguindo rigorosamente o critério de **Organização de arquivos e recursos**, a estrutura de pastas do repositório foi remodelada para garantir clareza e facilidade de manutenção:

```bash
Trabalho Site/
│
├── front-end/           # Recursos da Interface do Usuário
│   ├── index.html       # Estrutura HTML e Modais
│   ├── style.css        # Folha de Estilo responsiva (estilo premium)
│   └── app.js           # Lógica cliente, validações e comunicação com API
│
├── back-end/            # Servidor API e Código do Servidor
│   ├── server.js        # Inicialização do Express, Endpoints e Auto-Semeador
│   ├── db.js            # Classe DatabaseManager (Conexão MySQL)
│   ├── models.js        # Classes de Domínio OO (Pedido, Produto, Item)
│   └── package.json     # Gerenciamento de dependências Node.js
│
├── script-bd/           # Scripts do Banco de Dados Relacional
│   └── database.sql     # Estrutura de Tabelas e Seed do MySQL
│
├── imagens/             # Pasta reservada para imagens e fotos
│   └── .gitkeep         # Mantém a pasta rastreada no GitHub
│
└── README.md            # Este manual geral da entrega
```

---

## 🎨 Boas Práticas e Programação Orientada a Objetos (POO)
Como exigido pelo critério **Aplicação de boas práticas de programação**, o back-end foi implementado utilizando **Classes** com encapsulamento estrito (atributos privados), comentários padronizados JSDoc e métodos Get/Set:

*   **Classe `Produto` (`back-end/models.js`)**: Encapsula `#id`, `#nome`, `#descricao`, `#preco`, `#categoria` e `#imagemUrl`. Possui getters e setters públicos.
*   **Classe `ItemPedido` (`back-end/models.js`)**: Encapsula os dados do item e as notas de avaliação (`#avaliacaoEstrelas`, `#avaliacaoComentario`).
*   **Classe `Pedido` (`back-end/models.js`)**: Modela a compra inteira, controlando a lista de itens (`adicionarItem(item)`) e contendo o método de serialização `toJSON()`.

---

## 🔌 Gerenciamento Adequado da Conexão com MySQL
Para cumprir a rubrica de **Gerenciamento adequado da conexão com o banco de dados**, criamos a classe **`DatabaseManager`** (`back-end/db.js`), que abstrai e protege o pool de conexões com dois métodos explícitos de controle de fluxo de conexão:

1.  **`DatabaseManager.abrirConexao()`**: Abre de forma segura uma conexão temporária do pool, encapsulando o tratamento de exceções com blocos `try/catch`.
2.  **`DatabaseManager.fecharConexao(connection)`**: Garante o fechamento seguro e liberação da conexão de volta ao pool no bloco `finally`, evitando resource leaks (vazamento de conexões).

---

## 📝 Validação de Formulários & Regras de Negócio
A tela implementa **dois fluxos de formulários interativos** com **validação de campos estrita baseada em regras de negócio**:

### 1. Formulário de Simulação de Compra (`front-end/index.html`)
*   **Regra de Negócio de Quantidade**: A quantidade deve ser obrigatoriamente um **número inteiro entre 1 e 10**. Caso o valor seja decimal, menor que 1 ou maior que 10, um aviso em vermelho é exibido na tela e o botão de envio é bloqueado.
*   **Regra de Negócio do Cupom**: Inserindo o cupom **`MINAS10`** (case-insensitive), o front-end valida na hora, exibe um badge verde de cupom ativo e realiza o cálculo de **10% de desconto** no total dinamicamente. O desconto também é validado e aplicado no back-end.
*   **Regra de Notas de Entrega**: Limite físico de **150 caracteres** monitorado por um contador de caracteres em tempo real (`X / 150`). Exceder o limite acusa erro e desabilita o formulário.

### 2. Formulário de Avaliação do Produto (`front-end/index.html`)
*   **Regra de Estrela**: Exige a marcação de pelo menos **1 estrela** (validação de campo obrigatório).
*   **Regra de Comentário**: O comentário é opcional, mas se o cliente decidir digitar algo, deve ter **pelo menos 10 caracteres** para garantir um comentário útil, exibindo aviso de erro em caso de textos curtos.

---

## 🚀 Como Visualizar e Testar a Aplicação

### 🔗 Site Hospedado e Live (Vercel + MySQL Cloud)
A aplicação front-end está **hospedada e online**! Ela se conecta à nossa API conectada ao banco MySQL na nuvem.
👉 **Link público:** [**maravilhas-da-roca.vercel.app**](https://maravilhas-da-roca.vercel.app)

### Execução Local (Híbrida Sem Instalar Nada)
1.  Vá na pasta **`front-end/`**.
2.  Dê dois cliques no arquivo **`index.html`**.
3.  Ele abrirá no navegador e funcionará imediatamente buscando as informações em tempo real no banco MySQL hospedado na nuvem!

### Execução Local com Servidor Express
1.  Instale o **Node.js** em seu computador.
2.  Abra o terminal na pasta **`back-end/`** e execute:
    ```bash
    npm install
    npm start
    ```
3.  Abra o arquivo `front-end/index.html` no seu navegador. O JavaScript detectará o servidor local e rodará tudo localmente!

---

## 🗄️ Credenciais do MySQL Hospedado na Nuvem (Clever Cloud)
Caso o professor queira se conectar direto no MySQL usando o **DBeaver** ou **MySQL Workbench**:
*   **SGBD**: MySQL (v8.0)
*   **Host**: `btx4j1s9gcl0j1q8s6x5-mysql.services.clever-cloud.com`
*   **Porta**: `3306`
*   **Database (Schema)**: `btx4j1s9gcl0j1q8s6x5`
*   **Usuário**: `ufzstfngpobf3zcy`
*   **Senha**: `s2XGqD3lA0Q3wB5Tshn8`
