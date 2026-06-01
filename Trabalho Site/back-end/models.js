/**
 * Class representing a Product (Produto)
 * Segue boas práticas de POO: Atributos privados e métodos Get/Set
 */
class Produto {
  // Atributos privados
  #id;
  #nome;
  #descricao;
  #preco;
  #categoria;
  #imagemUrl;

  /**
   * Constructor for Produto
   * @param {number} id - Product ID
   * @param {string} nome - Product name
   * @param {string} descricao - Product description
   * @param {number} preco - Product price
   * @param {string} categoria - Product category
   * @param {string} imagemUrl - Product image URL
   */
  constructor(id, nome, descricao, preco, categoria, imagemUrl) {
    this.#id = id;
    this.#nome = nome;
    this.#descricao = descricao;
    this.#preco = parseFloat(preco);
    this.#categoria = categoria;
    this.#imagemUrl = imagemUrl;
  }

  // Getters e Setters
  get id() { return this.#id; }
  set id(value) { this.#id = value; }

  get nome() { return this.#nome; }
  set nome(value) { this.#nome = value; }

  get descricao() { return this.#descricao; }
  set descricao(value) { this.#descricao = value; }

  get preco() { return this.#preco; }
  set preco(value) { this.#preco = parseFloat(value); }

  get categoria() { return this.#categoria; }
  set categoria(value) { this.#categoria = value; }

  get imagemUrl() { return this.#imagemUrl; }
  set imagemUrl(value) { this.#imagemUrl = value; }

  /**
   * Converte a instância da classe em um objeto JSON simples
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      descricao: this.#descricao,
      preco: this.#preco,
      categoria: this.#categoria,
      imagemUrl: this.#imagemUrl
    };
  }
}

/**
 * Class representing an Item in an Order (ItemPedido)
 * Segue boas práticas de POO: Atributos privados e métodos Get/Set
 */
class ItemPedido {
  // Atributos privados
  #id;
  #pedidoId;
  #produtoId;
  #quantidade;
  #precoUnitario;
  #avaliacaoEstrelas;
  #avaliacaoComentario;
  #produtoInfo; // Dados do produto associado

  /**
   * Constructor for ItemPedido
   */
  constructor(id, pedidoId, produtoId, quantidade, precoUnitario, avaliacaoEstrelas = null, avaliacaoComentario = null) {
    this.#id = id;
    this.#pedidoId = pedidoId;
    this.#produtoId = produtoId;
    this.#quantidade = parseInt(quantidade);
    this.#precoUnitario = parseFloat(precoUnitario);
    this.#avaliacaoEstrelas = avaliacaoEstrelas;
    this.#avaliacaoComentario = avaliacaoComentario;
    this.#produtoInfo = null;
  }

  // Getters e Setters
  get id() { return this.#id; }
  set id(value) { this.#id = value; }

  get pedidoId() { return this.#pedidoId; }
  set pedidoId(value) { this.#pedidoId = value; }

  get produtoId() { return this.#produtoId; }
  set produtoId(value) { this.#produtoId = value; }

  get quantidade() { return this.#quantidade; }
  set quantidade(value) { this.#quantidade = parseInt(value); }

  get precoUnitario() { return this.#precoUnitario; }
  set precoUnitario(value) { this.#precoUnitario = parseFloat(value); }

  get avaliacaoEstrelas() { return this.#avaliacaoEstrelas; }
  set avaliacaoEstrelas(value) { this.#avaliacaoEstrelas = value; }

  get avaliacaoComentario() { return this.#avaliacaoComentario; }
  set avaliacaoComentario(value) { this.#avaliacaoComentario = value; }

  get produtoInfo() { return this.#produtoInfo; }
  set produtoInfo(value) { this.#produtoInfo = value; }

  /**
   * Converte a instância em um objeto JSON simples
   */
  toJSON() {
    return {
      id: this.#id,
      pedidoId: this.#pedidoId,
      produtoId: this.#produtoId,
      quantidade: this.#quantidade,
      precoUnitario: this.#precoUnitario,
      avaliacaoEstrelas: this.#avaliacaoEstrelas,
      avaliacaoComentario: this.#avaliacaoComentario,
      produto: this.#produtoInfo ? this.#produtoInfo.toJSON() : null
    };
  }
}

/**
 * Class representing an Order (Pedido)
 * Segue boas práticas de POO: Atributos privados e métodos Get/Set
 */
class Pedido {
  // Atributos privados
  #id;
  #usuarioId;
  #dataPedido;
  #total;
  #status;
  #codigoRastreio;
  #itens; // Lista de objetos ItemPedido

  /**
   * Constructor for Pedido
   */
  constructor(id, usuarioId, dataPedido, total, status, codigoRastreio = null) {
    this.#id = id;
    this.#usuarioId = usuarioId;
    this.#dataPedido = dataPedido;
    this.#total = parseFloat(total);
    this.#status = status;
    this.#codigoRastreio = codigoRastreio;
    this.#itens = [];
  }

  // Getters e Setters
  get id() { return this.#id; }
  set id(value) { this.#id = value; }

  get usuarioId() { return this.#usuarioId; }
  set usuarioId(value) { this.#usuarioId = value; }

  get dataPedido() { return this.#dataPedido; }
  set dataPedido(value) { this.#dataPedido = value; }

  get total() { return this.#total; }
  set total(value) { this.#total = parseFloat(value); }

  get status() { return this.#status; }
  set status(value) { this.#status = value; }

  get codigoRastreio() { return this.#codigoRastreio; }
  set codigoRastreio(value) { this.#codigoRastreio = value; }

  get itens() { return this.#itens; }
  
  /**
   * Adiciona um ItemPedido ao pedido
   * @param {ItemPedido} item 
   */
  adicionarItem(item) {
    if (item instanceof ItemPedido) {
      this.#itens.push(item);
    }
  }

  /**
   * Converte a instância em um objeto JSON simples
   */
  toJSON() {
    return {
      id: this.#id,
      usuarioId: this.#usuarioId,
      date: this.#dataPedido,
      total: this.#total,
      status: this.#status,
      tracking_code: this.#codigoRastreio,
      items: this.#itens.map(item => ({
        id: item.id,
        product_id: item.produtoId,
        name: item.produtoInfo ? item.produtoInfo.nome : 'Produto',
        description: item.produtoInfo ? item.produtoInfo.descricao : '',
        category: item.produtoInfo ? item.produtoInfo.categoria : '',
        image_url: item.produtoInfo ? item.produtoInfo.imagemUrl : '',
        quantity: item.quantidade,
        price: item.precoUnitario,
        rating: item.avaliacaoEstrelas,
        comment: item.avaliacaoComentario
      }))
    };
  }
}

module.exports = { Produto, ItemPedido, Pedido };
