-- ==========================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- MARAVILHAS DA ROÇA - SABOR ANCESTRAL
-- Trabalho Prático PUC Minas - Sprint 4
-- ==========================================

CREATE DATABASE IF NOT EXISTS `maravilhas_da_roca` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `maravilhas_da_roca`;

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `telefone` VARCHAR(20),
  `endereco` VARCHAR(255) NOT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela de Produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `descricao` TEXT,
  `preco` DECIMAL(10,2) NOT NULL,
  `categoria` VARCHAR(50) NOT NULL,
  `imagem_url` VARCHAR(255) NOT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `data_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `total` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Aguardando Pagamento', 'Em Preparo', 'Em Trânsito', 'Entregue') NOT NULL DEFAULT 'Aguardando Pagamento',
  `codigo_rastreio` VARCHAR(50) NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabela de Itens do Pedido (Relacional N:N entre Pedidos e Produtos)
CREATE TABLE IF NOT EXISTS `itens_pedido` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT NOT NULL,
  `produto_id` INT NOT NULL,
  `quantidade` INT NOT NULL DEFAULT 1,
  `preco_unitario` DECIMAL(10,2) NOT NULL,
  `avaliacao_estrelas` INT NULL,
  `avaliacao_comentario` TEXT NULL,
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- INSERÇÃO DE DADOS DE TESTE (SEED DATA)
-- ==========================================

-- Inserindo o usuário padrão (Cliente)
INSERT INTO `usuarios` (`id`, `nome`, `email`, `telefone`, `endereco`) VALUES
(1, 'Carlos Eduardo', 'carloseduardo@pucminas.br', '(31) 98888-7777', 'Av. Dom José Gaspar, 500 - Coração Eucarístico, Belo Horizonte - MG, 30535-901');

-- Inserindo os produtos clássicos com as imagens idênticas ao print
INSERT INTO `produtos` (`id`, `nome`, `descricao`, `preco`, `categoria`, `imagem_url`) VALUES
(1, 'Queijo Canastra Real', 'Queijo curado artesanal produzido na Serra da Canastra, textura macia por dentro e casca amarelada firme.', 45.00, 'Queijos', 'https://images.unsplash.com/photo-1528750951167-a5e8b310c030?q=80&w=600&auto=format&fit=crop'),
(2, 'Doce de Leite Mineiro', 'Tradicional doce de leite cremoso feito em tacho de cobre no interior de Minas Gerais, textura aveludada.', 25.00, 'Doces & Geléias', 'https://images.unsplash.com/photo-1589119908995-c6800efec38b?q=80&w=600&auto=format&fit=crop'),
(3, 'Mel de Abelha Puro', 'Mel natural extraído diretamente dos apiários das serras mineiras, sabor silvestre autêntico.', 30.00, 'Doces & Geléias', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop'),
(4, 'Pimenta de Roça Extra', 'Pimenta malagueta curtida de forma artesanal direto da roça, ardência equilibrada e muito aroma.', 15.00, 'Bebidas', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop'),
(5, 'Licor de Jabuticaba', 'Licor artesanal mineiro de jabuticaba colhida no pé, maturado lentamente para um sabor adocicado e marcante.', 35.00, 'Bebidas', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop');

-- Inserindo o histórico de compras/pedidos
-- Pedido 1001: Entregue
INSERT INTO `pedidos` (`id`, `usuario_id`, `data_pedido`, `total`, `status`, `codigo_rastreio`) VALUES
(1001, 1, '2026-05-18 14:20:00', 100.00, 'Entregue', 'MR-84729104-BR');

-- Pedido 1002: Em Trânsito
INSERT INTO `pedidos` (`id`, `usuario_id`, `data_pedido`, `total`, `status`, `codigo_rastreio`) VALUES
(1002, 1, '2026-05-29 10:15:00', 65.00, 'Em Trânsito', 'MR-30847291-BR');

-- Pedido 1003: Em Preparo
INSERT INTO `pedidos` (`id`, `usuario_id`, `data_pedido`, `total`, `status`, `codigo_rastreio`) VALUES
(1003, 1, '2026-05-31 16:45:00', 90.00, 'Em Preparo', 'MR-58291048-BR');

-- Pedido 1004: Aguardando Pagamento
INSERT INTO `pedidos` (`id`, `usuario_id`, `data_pedido`, `total`, `status`, `codigo_rastreio`) VALUES
(1004, 1, '2026-06-01 00:30:00', 55.00, 'Aguardando Pagamento', NULL);

-- Inserindo os itens vinculados a cada pedido
-- Pedido 1001 (Total 100.00) -> 1x Queijo Canastra (45.00) + 1x Doce de Leite (25.00) + 1x Mel Puro (30.00)
INSERT INTO `itens_pedido` (`pedido_id`, `produto_id`, `quantidade`, `preco_unitario`, `avaliacao_estrelas`, `avaliacao_comentario`) VALUES
(1001, 1, 1, 45.00, 5, 'Excelente queijo, o puro sabor de Minas!'),
(1001, 2, 1, 25.00, NULL, NULL),
(1001, 3, 1, 30.00, NULL, NULL);

-- Pedido 1002 (Total 65.00) -> 2x Pimenta de Roça (15.00 * 2 = 30.00) + 1x Licor de Jabuticaba (35.00)
INSERT INTO `itens_pedido` (`pedido_id`, `produto_id`, `quantidade`, `preco_unitario`, `avaliacao_estrelas`, `avaliacao_comentario`) VALUES
(1002, 4, 2, 15.00, NULL, NULL),
(1002, 5, 1, 35.00, NULL, NULL);

-- Pedido 1003 (Total 90.00) -> 2x Queijo Canastra (45.00 * 2 = 90.00)
INSERT INTO `itens_pedido` (`pedido_id`, `produto_id`, `quantidade`, `preco_unitario`, `avaliacao_estrelas`, `avaliacao_comentario`) VALUES
(1003, 1, 2, 45.00, NULL, NULL);

-- Pedido 1004 (Total 55.00) -> 1x Doce de Leite (25.00) + 1x Mel Puro (30.00)
INSERT INTO `itens_pedido` (`pedido_id`, `produto_id`, `quantidade`, `preco_unitario`, `avaliacao_estrelas`, `avaliacao_comentario`) VALUES
(1004, 2, 1, 25.00, NULL, NULL),
(1004, 3, 1, 30.00, NULL, NULL);
