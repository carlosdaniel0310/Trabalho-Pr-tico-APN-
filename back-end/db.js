const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Class representing the Database Manager (DatabaseManager)
 * Gerencia a abertura e fechamento seguro das conexões com o MySQL
 */
class DatabaseManager {
  // Pool de conexões do MySQL (estático para ser compartilhado)
  static #pool = null;

  /**
   * Inicializa o pool de conexões do MySQL
   * @private
   */
  static #inicializarPool() {
    if (!DatabaseManager.#pool) {
      console.log('⚡ Inicializando pool de conexões MySQL...');
      
      const dbConfig = {
        host: process.env.DB_HOST || 'btx4j1s9gcl0j1q8s6x5-mysql.services.clever-cloud.com',
        user: process.env.DB_USER || 'ufzstfngpobf3zcy',
        password: process.env.DB_PASSWORD || 's2XGqD3lA0Q3wB5Tshn8',
        database: process.env.DB_NAME || 'btx4j1s9gcl0j1q8s6x5',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      };

      DatabaseManager.#pool = mysql.createPool(dbConfig);
    }
  }

  /**
   * Método para ABRIR uma conexão com o Banco de Dados MySQL
   * Tratamento de exceções robusto e retorno seguro de conexão
   * @returns {Promise<mysql.PoolConnection>} A conexão ativa do MySQL
   * @throws {Error} Se falhar ao abrir a conexão
   */
  static async abrirConexao() {
    try {
      // Garante que o pool foi criado
      DatabaseManager.#inicializarPool();
      
      // Abre a conexão
      const connection = await DatabaseManager.#pool.getConnection();
      console.log('🔌 Conexão ABERTA com sucesso no MySQL.');
      return connection;
    } catch (error) {
      console.error('❌ Erro crítico ao ABRIR conexão com o MySQL:', error.message);
      throw new Error(`Falha na abertura de conexão: ${error.message}`);
    }
  }

  /**
   * Método para FECHAR/LIBERAR uma conexão de volta para o pool
   * Evita vazamentos de recursos (resource leaks) garantindo fechamento seguro
   * @param {mysql.PoolConnection} connection - Conexão a ser fechada
   */
  static async fecharConexao(connection) {
    try {
      if (connection) {
        // No caso de pool do mysql2, connection.release() fecha a conexão temporária e a devolve ao pool
        await connection.release();
        console.log('🔌 Conexão FECHADA/LIBERADA de forma segura.');
      }
    } catch (error) {
      console.error('❌ Erro ao FECHAR/LIBERAR a conexão com o MySQL:', error.message);
    }
  }

  /**
   * Executa uma query SQL direta abrindo e fechando a conexão automaticamente
   * @param {string} sql - Comando SQL
   * @param {Array} params - Parâmetros da query
   * @returns {Promise<Array>} Resultado da query [rows, fields]
   */
  static async executarQuery(sql, params = []) {
    let connection = null;
    try {
      // 1. Abre a conexão usando o método obrigatório
      connection = await DatabaseManager.abrirConexao();
      
      // 2. Executa a query
      const [rows, fields] = await connection.query(sql, params);
      return rows;
    } catch (error) {
      console.error('❌ Erro ao executar query SQL:', error.message);
      throw error;
    } finally {
      // 3. Garante o FECHAMENTO seguro da conexão sob qualquer circunstância
      if (connection) {
        await DatabaseManager.fecharConexao(connection);
      }
    }
  }

  /**
   * Obtém o pool completo em caso de transações avançadas
   */
  static getPool() {
    DatabaseManager.#inicializarPool();
    return DatabaseManager.#pool;
  }
}

module.exports = DatabaseManager;
