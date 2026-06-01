const express = require('express');
const cors = require('cors');
const DatabaseManager = require('./db');
const { Produto, ItemPedido, Pedido } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * Função auto-executável para inicializar e semear o banco de dados MySQL na Nuvem.
 * Garante que a estrutura relacional do print esteja pronta para uso imediato.
 */
async function initializeDatabase() {
  let connection = null;
  try {
    // 1. Abre conexão utilizando o método específico do DatabaseManager
    connection = await DatabaseManager.abrirConexao();

    // Criar tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`usuarios\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`nome\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL UNIQUE,
        \`telefone\` VARCHAR(20),
        \`endereco\` VARCHAR(255) NOT NULL,
        \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de produtos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`produtos\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`nome\` VARCHAR(150) NOT NULL,
        \`descricao\` TEXT,
        \`preco\` DECIMAL(10,2) NOT NULL,
        \`categoria\` VARCHAR(50) NOT NULL,
        \`imagem_url\` VARCHAR(255) NOT NULL,
        \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de pedidos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`pedidos\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`usuario_id\` INT NOT NULL,
        \`data_pedido\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`total\` DECIMAL(10,2) NOT NULL,
        \`status\` ENUM('Aguardando Pagamento', 'Em Preparo', 'Em Trânsito', 'Entregue') NOT NULL DEFAULT 'Aguardando Pagamento',
        \`codigo_rastreio\` VARCHAR(50) NULL,
        FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Criar tabela de itens do pedido
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`itens_pedido\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`pedido_id\` INT NOT NULL,
        \`produto_id\` INT NOT NULL,
        \`quantidade\` INT NOT NULL DEFAULT 1,
        \`preco_unitario\` DECIMAL(10,2) NOT NULL,
        \`avaliacao_estrelas\` INT NULL,
        \`avaliacao_comentario\` TEXT NULL,
        FOREIGN KEY (\`pedido_id\`) REFERENCES \`pedidos\`(\`id\`) ON DELETE CASCADE,
        FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('✅ Estrutura de Tabelas verificada/criada no MySQL.');

    // Semear Usuário padrão se estiver vazio
    const [users] = await connection.query('SELECT COUNT(*) as count FROM usuarios');
    if (users[0].count === 0) {
      await connection.query(`
        INSERT INTO \`usuarios\` (\`id\`, \`nome\`, \`email\`, \`telefone\`, \`endereco\`) VALUES
        (1, 'Carlos Eduardo', 'carloseduardo@pucminas.br', '(31) 98888-7777', 'Av. Dom José Gaspar, 500 - Coração Eucarístico, Belo Horizonte - MG, 30535-901');
      `);
      console.log('👤 Usuário padrão semeado.');
    }

    // Semear Produtos se estiver vazio
    const [products] = await connection.query('SELECT COUNT(*) as count FROM produtos');
    if (products[0].count === 0) {
      await connection.query(`
        INSERT INTO \`produtos\` (\`id\`, \`nome\`, \`descricao\`, \`preco\`, \`categoria\`, \`imagem_url\`) VALUES
        (1, 'Queijo Canastra Real', 'Queijo curado artesanal produzido na Serra da Canastra, textura macia por dentro e casca amarelada firme.', 45.00, 'Queijos', 'https://images.unsplash.com/photo-1528750951167-a5e8b310c030?q=80&w=600&auto=format&fit=crop'),
        (2, 'Doce de Leite Mineiro', 'Tradicional doce de leite cremoso feito em tacho de cobre no interior de Minas Gerais, textura aveludada.', 25.00, 'Doces & Geléias', 'https://images.unsplash.com/photo-1589119908995-c6800efec38b?q=80&w=600&auto=format&fit=crop'),
        (3, 'Mel de Abelha Puro', 'Mel natural extraído diretamente dos apiários das serras mineiras, sabor silvestre autêntico.', 30.00, 'Doces & Geléias', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop'),
        (4, 'Pimenta de Roça Extra', 'Pimenta malagueta curtida de forma artesanal direto da roça, ardência equilibrada e muito aroma.', 15.00, 'Bebidas', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop'),
        (5, 'Licor de Jabuticaba', 'Licor artesanal mineiro de jabuticaba colhida no pé, maturado lentamente para um sabor adocicado e marcante.', 35.00, 'Bebidas', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop');
      `);
      console.log('🍯 Produtos semeados.');
    }

    // Semear Pedidos Históricos se estiver vazio
    const [orders] = await connection.query('SELECT COUNT(*) as count FROM pedidos');
    if (orders[0].count === 0) {
      await connection.query(`
        INSERT INTO \`pedidos\` (\`id\`, \`usuario_id\`, \`data_pedido\`, \`total\`, \`status\`, \`codigo_rastreio\`) VALUES
        (1001, 1, '2026-05-18 14:20:00', 100.00, 'Entregue', 'MR-84729104-BR'),
        (1002, 1, '2026-05-29 10:15:00', 65.00, 'Em Trânsito', 'MR-30847291-BR'),
        (1003, 1, '2026-05-31 16:45:00', 90.00, 'Em Preparo', 'MR-58291048-BR'),
        (1004, 1, '2026-06-01 00:30:00', 55.00, 'Aguardando Pagamento', NULL);
      `);

      await connection.query(`
        INSERT INTO \`itens_pedido\` (\`pedido_id\`, \`produto_id\`, \`quantidade\`, \`preco_unitario\`) VALUES
        (1001, 1, 1, 45.00),
        (1001, 2, 1, 25.00),
        (1001, 3, 1, 30.00),
        (1002, 4, 2, 15.00),
        (1002, 5, 1, 35.00),
        (1003, 1, 2, 45.00),
        (1004, 2, 1, 25.00),
        (1004, 3, 1, 30.00);
      `);
      console.log('🛍️ Histórico de pedidos semeado.');
    }

  } catch (error) {
    console.error('❌ Erro durante a inicialização do MySQL:', error.message);
  } finally {
    // 2. Garante o fechamento seguro utilizando o método fecharConexao
    if (connection) {
      await DatabaseManager.fecharConexao(connection);
    }
  }
}

// Executar auto-semeador ao subir o servidor
initializeDatabase();

// ==========================================
// ENDPOINTS REST (CONECTADOS AO BANCO E POO)
// ==========================================

/**
 * 1. LISTAR COMPRAS (READ)
 * Busca os pedidos e formata mapeando-os para instâncias das classes Pedido, ItemPedido e Produto.
 */
app.get('/api/orders', async (req, res) => {
  let connection = null;
  try {
    connection = await DatabaseManager.abrirConexao();
    
    const query = `
      SELECT 
        p.id AS order_id, 
        p.data_pedido AS order_date, 
        p.total AS order_total, 
        p.status AS order_status, 
        p.codigo_rastreio AS order_tracking,
        ip.id AS item_id,
        ip.quantidade AS item_quantity,
        ip.preco_unitario AS item_price,
        ip.avaliacao_estrelas AS item_rating,
        ip.avaliacao_comentario AS item_comment,
        pr.id AS product_id,
        pr.nome AS product_name,
        pr.descricao AS product_description,
        pr.categoria AS product_category,
        pr.imagem_url AS product_image
      FROM pedidos p
      JOIN itens_pedido ip ON p.id = ip.pedido_id
      JOIN produtos pr ON ip.produto_id = pr.id
      WHERE p.usuario_id = 1
      ORDER BY p.data_pedido DESC;
    `;

    const [rows] = await connection.query(query);

    // Mapeamento Orientado a Objetos (POO)
    const ordersMap = {};
    rows.forEach(row => {
      // Se o pedido ainda não está no mapa, cria a instância da classe Pedido
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = new Pedido(
          row.order_id,
          1,
          row.order_date,
          row.order_total,
          row.order_status,
          row.order_tracking
        );
      }

      // Cria as instâncias das classes ItemPedido e Produto
      const item = new ItemPedido(
        row.item_id,
        row.order_id,
        row.product_id,
        row.item_quantity,
        row.item_price,
        row.item_rating,
        row.item_comment
      );

      const produto = new Produto(
        row.product_id,
        row.product_name,
        row.product_description,
        row.item_price,
        row.product_category,
        row.product_image
      );

      // Associa o produto ao item do pedido
      item.produtoInfo = produto;
      
      // Adiciona o item ao pedido usando o método público da classe Pedido
      ordersMap[row.order_id].adicionarItem(item);
    });

    // Converte todas as instâncias de classe em objetos JSON padronizados via toJSON()
    const ordersList = Object.values(ordersMap).map(p => p.toJSON());
    
    res.json({ success: true, orders: ordersList });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ success: false, error: 'Erro interno no MySQL.' });
  } finally {
    if (connection) {
      await DatabaseManager.fecharConexao(connection);
    }
  }
});

/**
 * 2. CADASTRAR COMPRA (CREATE)
 * Cria um novo pedido de compra no banco de dados com validação de campos no backend.
 */
app.post('/api/orders/new', async (req, res) => {
  const { products, coupon } = req.body;
  
  // Validação de Campos (Backend validation / Regra de Negócio)
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ success: false, error: 'Lista de produtos inválida.' });
  }

  for (const item of products) {
    if (!item.product_id || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({ success: false, error: 'Produto ou quantidade inválida.' });
    }
  }

  let connection = null;
  try {
    connection = await DatabaseManager.abrirConexao();
    await connection.beginTransaction();

    // Calcular o total
    let subtotal = 0;
    for (const item of products) {
      // Busca preço atualizado no banco de dados para evitar fraude
      const [prodRows] = await connection.query('SELECT preco FROM produtos WHERE id = ?', [item.product_id]);
      if (prodRows.length === 0) {
        throw new Error(`Produto ID ${item.product_id} não encontrado.`);
      }
      const precoAtual = parseFloat(prodRows[0].preco);
      subtotal += precoAtual * item.quantity;
    }

    // Regra de Negócio: Validação de cupom de desconto
    let total = subtotal;
    let descontoAplicado = 0;
    if (coupon && coupon.trim().toUpperCase() === 'MINAS10') {
      descontoAplicado = subtotal * 0.10;
      total = subtotal - descontoAplicado;
      console.log(`🎟️ Cupom MINAS10 aplicado. Desconto de R$ ${descontoAplicado.toFixed(2)}`);
    }

    const trackingCode = `MR-${Math.floor(10000000 + Math.random() * 90000000)}-BR`;

    // Inserir pedido
    const [orderResult] = await connection.query(
      'INSERT INTO pedidos (usuario_id, total, status, codigo_rastreio) VALUES (?, ?, ?, ?)',
      [1, total, 'Em Preparo', trackingCode]
    );
    
    const newOrderId = orderResult.insertId;

    // Inserir itens
    for (const item of products) {
      const [prodRows] = await connection.query('SELECT preco FROM produtos WHERE id = ?', [item.product_id]);
      const precoUnitario = parseFloat(prodRows[0].preco);

      await connection.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [newOrderId, item.product_id, item.quantity, precoUnitario]
      );
    }

    await connection.commit();
    res.json({
      success: true,
      message: 'Compra realizada e gravada no MySQL com sucesso!',
      order_id: newOrderId,
      total_total: total,
      discount: descontoAplicado,
      tracking_code: trackingCode
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Erro na nova compra:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) {
      await DatabaseManager.fecharConexao(connection);
    }
  }
});

/**
 * 3. AVALIAR COMPRA (UPDATE)
 * Atualiza um item do pedido cadastrando a nota e o comentário.
 */
app.post('/api/orders/rate', async (req, res) => {
  const { item_id, rating, comment } = req.body;
  
  // Validação das Regras de Negócio de avaliação
  if (!item_id || rating === undefined) {
    return res.status(400).json({ success: false, error: 'ID do item e nota são obrigatórios.' });
  }

  const nota = parseInt(rating);
  if (nota < 1 || nota > 5) {
    return res.status(400).json({ success: false, error: 'A avaliação deve ser de 1 a 5 estrelas.' });
  }

  let connection = null;
  try {
    connection = await DatabaseManager.abrirConexao();
    
    const [result] = await connection.query(
      'UPDATE itens_pedido SET avaliacao_estrelas = ?, avaliacao_comentario = ? WHERE id = ?',
      [nota, comment || '', item_id]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Avaliação gravada com sucesso no MySQL!' });
    } else {
      res.status(444).json({ success: false, error: 'Item de pedido não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao avaliar item:', error);
    res.status(500).json({ success: false, error: 'Erro no servidor.' });
  } finally {
    if (connection) {
      await DatabaseManager.fecharConexao(connection);
    }
  }
});

/**
 * 4. EXCLUIR PEDIDO (DELETE)
 * Exclui o pedido por completo do banco de dados MySQL.
 */
app.delete('/api/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  
  let connection = null;
  try {
    connection = await DatabaseManager.abrirConexao();
    
    // Executa a exclusão. O MySQL tratará do cascade das chaves estrangeiras.
    const [result] = await connection.query('DELETE FROM pedidos WHERE id = ?', [orderId]);
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: `Pedido #MR-${orderId} excluído com sucesso do MySQL!` });
    } else {
      res.status(444).json({ success: false, error: 'Pedido não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao excluir:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao excluir.' });
  } finally {
    if (connection) {
      await DatabaseManager.fecharConexao(connection);
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Produção da PUC Minas rodando na porta ${PORT}`);
});
