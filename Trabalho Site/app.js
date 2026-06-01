/* ==========================================================================
   LÓGICA JAVASCRIPT: MARAVILHAS DA ROÇA - SABOR ANCESTRAL
   Trabalho de Faculdade - PUC Minas (Integração com MySQL na Nuvem e Simulador)
   ========================================================================== */

// Configuração dos Endpoints (Local e Nuvem como Fallback)
let API_BASE_URL = 'https://maravilhas-da-roca-api.onrender.com/api';
const LOCAL_API = 'http://localhost:3000/api';

// Banco de Dados Simulador (Garante funcionamento 100% instantâneo e offline)
const MOCK_MYSQL_DB = [
  {
    id: 1001,
    date: '2026-05-18T14:20:00.000Z',
    total: 100.00,
    status: 'Entregue',
    tracking_code: 'MR-84729104-BR',
    items: [
      { id: 1, product_id: 1, name: 'Queijo Canastra Real', description: 'Queijo curado artesanal produzido na Serra da Canastra, textura macia por dentro e casca amarelada firme.', category: 'Queijos', image_url: 'https://images.unsplash.com/photo-1528750951167-a5e8b310c030?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 45.00, rating: 5, comment: 'Excelente queijo, o puro sabor de Minas!' },
      { id: 2, product_id: 2, name: 'Doce de Leite Mineiro', description: 'Tradicional doce de leite cremoso feito em tacho de cobre no interior de Minas Gerais, textura aveludada.', category: 'Doces & Geléias', image_url: 'https://images.unsplash.com/photo-1589119908995-c6800efec38b?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 25.00, rating: null, comment: null },
      { id: 3, product_id: 3, name: 'Mel de Abelha Puro', description: 'Mel natural extraído diretamente dos apiários das serras mineiras, sabor silvestre autêntico.', category: 'Doces & Geléias', image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 30.00, rating: null, comment: null }
    ]
  },
  {
    id: 1002,
    date: '2026-05-29T10:15:00.000Z',
    total: 65.00,
    status: 'Em Trânsito',
    tracking_code: 'MR-30847291-BR',
    items: [
      { id: 4, product_id: 4, name: 'Pimenta de Roça Extra', description: 'Pimenta malagueta curtida de forma artesanal direto da roça, ardência equilibrada e muito aroma.', category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop', quantity: 2, price: 15.00, rating: null, comment: null },
      { id: 5, product_id: 5, name: 'Licor de Jabuticaba', description: 'Licor artesanal mineiro de jabuticaba colhida no pé, maturado lentamente para um sabor adocicado e marcante.', category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 35.00, rating: null, comment: null }
    ]
  },
  {
    id: 1003,
    date: '2026-05-31T16:45:00.000Z',
    total: 90.00,
    status: 'Em Preparo',
    tracking_code: 'MR-58291048-BR',
    items: [
      { id: 6, product_id: 1, name: 'Queijo Canastra Real', description: 'Queijo curado artesanal produzido na Serra da Canastra, textura macia por dentro e casca amarelada firme.', category: 'Queijos', image_url: 'https://images.unsplash.com/photo-1528750951167-a5e8b310c030?q=80&w=600&auto=format&fit=crop', quantity: 2, price: 45.00, rating: null, comment: null }
    ]
  },
  {
    id: 1004,
    date: '2026-06-01T00:30:00.000Z',
    total: 55.00,
    status: 'Aguardando Pagamento',
    tracking_code: null,
    items: [
      { id: 7, product_id: 2, name: 'Doce de Leite Mineiro', description: 'Tradicional doce de leite cremoso feito em tacho de cobre no interior de Minas Gerais, textura aveludada.', category: 'Doces & Geléias', image_url: 'https://images.unsplash.com/photo-1589119908995-c6800efec38b?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 25.00, rating: null, comment: null },
      { id: 8, product_id: 3, name: 'Mel de Abelha Puro', description: 'Mel natural extraído diretamente dos apiários das serras mineiras, sabor silvestre autêntico.', category: 'Doces & Geléias', image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop', quantity: 1, price: 30.00, rating: null, comment: null }
    ]
  }
];

// Estado Global
let allOrders = [];
let activeStatusFilter = 'Todos';
let searchQuery = '';
let selectedRatingValue = 0;
let currentRatingItemId = null;
let isUsingSimulator = false;

// Elementos do DOM
const ordersGrid = document.getElementById('orders-grid');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterPills = document.querySelectorAll('.filter-pill');
const btnClearFilters = document.querySelector('.btn-clear-filters');

// Modais
const trackingModal = document.getElementById('tracking-modal');
const ratingModal = document.getElementById('rating-modal');
const buyFormModal = document.getElementById('buy-form-modal');

// Botões Abre/Fecha Modais
const btnOpenBuyForm = document.getElementById('btn-open-buy-form');
const closeBuyFormBtn = document.getElementById('close-buy-form-btn');
const closeTrackingBtn = document.getElementById('close-tracking-btn');
const closeRatingBtn = document.getElementById('close-rating-btn');

// Campos do Formulário de Compra e Validação
const simulatePurchaseForm = document.getElementById('simulate-purchase-form');
const formProductSelect = document.getElementById('form-product-select');
const formProductQty = document.getElementById('form-product-qty');
const formProductCoupon = document.getElementById('form-product-coupon');
const formProductNotes = document.getElementById('form-product-notes');

// Mensagens de Feedback de Validação
const qtyError = document.getElementById('qty-error');
const couponFeedback = document.getElementById('coupon-feedback');
const notesError = document.getElementById('notes-error');
const charCounter = document.getElementById('char-counter');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryDiscountRow = document.getElementById('summary-discount-row');
const summaryDiscount = document.getElementById('summary-discount');
const summaryTotal = document.getElementById('summary-total');

/* ==========================================
   1. INICIALIZAÇÃO E AUTO-DETECÇÃO DA API
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  setupEventListeners();
  setupFormValidationListeners();
  
  // Tenta detectar API Local ou Nuvem, ou carrega do simulador após 1.5s
  const detectPromise = detectBackend();
  const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1500));
  
  await Promise.race([detectPromise, timeoutPromise]);
  
  if (allOrders.length === 0) {
    await fetchOrders();
  }
});

// Detecção Automática do Servidor
async function detectBackend() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);
    
    const response = await fetch(`${LOCAL_API}/orders`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      API_BASE_URL = LOCAL_API;
      console.log("🔌 Conectado à API Local (localhost).");
      return;
    }
  } catch (error) {
    console.log("Servidor local não detectado.");
  }
}

// Atualizar indicador de status no rodapé
function updateStatusIndicator() {
  const statusDot = document.querySelector('.status-dot');
  const dbText = document.querySelector('.database-status-indicator');
  
  if (isUsingSimulator) {
    statusDot.style.backgroundColor = '#C3935B';
    dbText.innerHTML = '<span class="status-dot" style="background-color: #C3935B; box-shadow: 0 0 8px rgba(195,147,91,0.6)"></span> Modo de Demonstração (Simulador MySQL Ativo)';
  } else if (API_BASE_URL.includes('localhost')) {
    statusDot.style.backgroundColor = '#4CAF50';
    dbText.innerHTML = '<span class="status-dot green"></span> Conectado ao MySQL Local';
  } else {
    statusDot.style.backgroundColor = '#4CAF50';
    dbText.innerHTML = '<span class="status-dot green"></span> Conectado ao MySQL na Nuvem (Clever Cloud)';
  }
}

/* ==========================================
   2. REQUISIÇÕES AO BANCO DE DADOS (API / SIMULADOR)
   ========================================== */

// Buscar Pedidos (GET /api/orders)
async function fetchOrders() {
  showLoader(true);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    
    const response = await fetch(`${API_BASE_URL}/orders`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (data.success && data.orders.length > 0) {
      allOrders = data.orders;
      isUsingSimulator = false;
      console.log("📦 Dados reais carregados do MySQL na Nuvem!");
    } else {
      activateSimulator();
    }
  } catch (error) {
    console.warn("⚠️ Ativando simulador local instantâneo.");
    activateSimulator();
  } finally {
    updateStatusIndicator();
    filterAndRenderOrders();
    showLoader(false);
  }
}

function activateSimulator() {
  isUsingSimulator = true;
  if (allOrders.length === 0) {
    allOrders = JSON.parse(localStorage.getItem('maravilhas_orders')) || MOCK_MYSQL_DB;
    localStorage.setItem('maravilhas_orders', JSON.stringify(allOrders));
  }
}

// Enviar Avaliação (POST /api/orders/rate)
async function submitRating(itemId, rating, comment) {
  if (isUsingSimulator) {
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.id === itemId) {
          item.rating = rating;
          item.comment = comment;
        }
      });
    });
    localStorage.setItem('maravilhas_orders', JSON.stringify(allOrders));
    showToast("Sucesso! Avaliação gravada no Simulador MySQL.");
    closeModals();
    filterAndRenderOrders();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId, rating, comment })
    });
    
    const data = await response.json();
    if (data.success) {
      showToast("Sucesso! Avaliação salva no banco de dados MySQL!");
      closeModals();
      await fetchOrders();
    } else {
      alert("Erro ao salvar avaliação: " + data.error);
    }
  } catch (error) {
    isUsingSimulator = true;
    updateStatusIndicator();
    submitRating(itemId, rating, comment);
  }
}

// Criar Novo Pedido de Compra (POST /api/orders/new)
async function submitNewPurchase(productId, qty, couponCode) {
  const productsCatalog = {
    1: { id: 1, name: 'Queijo Canastra Real', description: 'Queijo curado artesanal produzido na Serra da Canastra, textura macia por dentro e casca amarelada firme.', category: 'Queijos', image_url: 'https://images.unsplash.com/photo-1528750951167-a5e8b310c030?q=80&w=600&auto=format&fit=crop', price: 45.00 },
    2: { id: 2, name: 'Doce de Leite Mineiro', description: 'Tradicional doce de leite cremoso feito em tacho de cobre no interior de Minas Gerais, textura aveludada.', category: 'Doces & Geléias', image_url: 'https://images.unsplash.com/photo-1589119908995-c6800efec38b?q=80&w=600&auto=format&fit=crop', price: 25.00 },
    3: { id: 3, name: 'Mel de Abelha Puro', description: 'Mel natural extraído diretamente dos apiários das serras mineiras, sabor silvestre autêntico.', category: 'Doces & Geléias', image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop', price: 30.00 },
    4: { id: 4, name: 'Pimenta de Roça Extra', description: 'Pimenta malagueta curtida de forma artesanal direto da roça, ardência equilibrada e muito aroma.', category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600&auto=format&fit=crop', price: 15.00 },
    5: { id: 5, name: 'Licor de Jabuticaba', description: 'Licor artesanal mineiro de jabuticaba colhida no pé, maturado lentamente para um sabor adocicado e marcante.', category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop', price: 35.00 }
  };

  const selectedProd = productsCatalog[productId];
  const formattedProducts = [{ product_id: parseInt(productId), quantity: parseInt(qty), price: selectedProd.price }];

  if (isUsingSimulator) {
    let subtotal = selectedProd.price * qty;
    let desconto = 0;
    if (couponCode && couponCode.toUpperCase() === 'MINAS10') {
      desconto = subtotal * 0.10;
    }
    let total = subtotal - desconto;
    const newOrderId = Math.floor(1005 + Math.random() * 1000);
    const trackingCode = `MR-${Math.floor(10000000 + Math.random() * 90000000)}-BR`;

    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      total: total,
      status: 'Em Preparo',
      tracking_code: trackingCode,
      items: [{
        id: Math.floor(100 + Math.random() * 1000),
        product_id: parseInt(productId),
        name: selectedProd.name,
        description: selectedProd.description,
        category: selectedProd.category,
        image_url: selectedProd.image_url,
        quantity: parseInt(qty),
        price: selectedProd.price,
        rating: null,
        comment: null
      }]
    };

    allOrders.unshift(newOrder);
    localStorage.setItem('maravilhas_orders', JSON.stringify(allOrders));
    showToast(`Pedido #${newOrderId} criado no Simulador MySQL local!`);
    activeStatusFilter = 'Todos';
    updateActiveFilterTab();
    filterAndRenderOrders();
    closeModals();
    return;
  }

  // Envia via API Cloud MySQL
  try {
    showLoader(true);
    const response = await fetch(`${API_BASE_URL}/orders/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: formattedProducts, coupon: couponCode })
    });
    
    const data = await response.json();
    if (data.success) {
      showToast(`Pedido #${data.order_id} gravado com sucesso no MySQL na Nuvem!`);
      activeStatusFilter = 'Todos';
      updateActiveFilterTab();
      await fetchOrders();
      closeModals();
    } else {
      alert("Erro ao gravar pedido: " + data.error);
    }
  } catch (error) {
    isUsingSimulator = true;
    updateStatusIndicator();
    await submitNewPurchase(productId, qty, couponCode);
  }
}

// Simular Recompra de Pedido Completo
async function requestRebuy(orderItems) {
  if (isUsingSimulator) {
    const total = orderItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const newOrderId = Math.floor(1005 + Math.random() * 1000);
    const trackingCode = `MR-${Math.floor(10000000 + Math.random() * 90000000)}-BR`;
    
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      total: total,
      status: 'Em Preparo',
      tracking_code: trackingCode,
      items: orderItems.map((item, idx) => ({
        id: Math.floor(100 + Math.random() * 1000) + idx,
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        category: item.category,
        image_url: item.image_url,
        quantity: item.quantity,
        price: item.price,
        rating: null,
        comment: null
      }))
    };
    
    allOrders.unshift(newOrder);
    localStorage.setItem('maravilhas_orders', JSON.stringify(allOrders));
    showToast(`Pedido #${newOrderId} duplicado com sucesso!`);
    activeStatusFilter = 'Todos';
    updateActiveFilterTab();
    filterAndRenderOrders();
    return;
  }

  try {
    const formattedProducts = orderItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));
    
    const response = await fetch(`${API_BASE_URL}/orders/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: formattedProducts })
    });
    
    const data = await response.json();
    if (data.success) {
      showToast(`Pedido #${data.order_id} duplicado com sucesso no MySQL!`);
      activeStatusFilter = 'Todos';
      updateActiveFilterTab();
      await fetchOrders();
    }
  } catch (error) {
    isUsingSimulator = true;
    updateStatusIndicator();
    requestRebuy(orderItems);
  }
}

// Excluir Pedido (DELETE)
window.triggerDeleteOrder = function(orderId) {
  const confirmText = `Deseja realmente excluir o pedido #MR-${orderId} do banco de dados MySQL? Esta ação não pode ser desfeita!`;
  if (confirm(confirmText)) {
    deleteOrder(orderId);
  }
};

async function deleteOrder(orderId) {
  if (isUsingSimulator) {
    allOrders = allOrders.filter(order => order.id !== orderId);
    localStorage.setItem('maravilhas_orders', JSON.stringify(allOrders));
    showToast(`Pedido #MR-${orderId} excluído do Simulador MySQL.`);
    filterAndRenderOrders();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data.success) {
      showToast(`Pedido #MR-${orderId} excluído do MySQL com sucesso!`);
      await fetchOrders();
    } else {
      alert("Erro ao excluir: " + data.error);
    }
  } catch (error) {
    isUsingSimulator = true;
    updateStatusIndicator();
    deleteOrder(orderId);
  }
}

/* ==========================================
   3. FILTRAGEM E RENDERIZAÇÃO NA TELA
   ========================================== */

function filterAndRenderOrders() {
  let filtered = allOrders;
  
  if (activeStatusFilter !== 'Todos') {
    filtered = filtered.filter(order => order.status === activeStatusFilter);
  }
  
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(order => {
      return order.items.some(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );
    });
  }
  
  renderOrders(filtered);
}

function renderOrders(orders) {
  ordersGrid.innerHTML = '';
  
  if (orders.length === 0) {
    emptyState.classList.remove('hidden');
    ordersGrid.classList.add('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  ordersGrid.classList.remove('hidden');
  
  orders.forEach(order => {
    let statusClass = 'badge-pending';
    if (order.status === 'Em Preparo') statusClass = 'badge-preparo';
    if (order.status === 'Em Trânsito') statusClass = 'badge-transito';
    if (order.status === 'Entregue') statusClass = 'badge-delivered';
    
    const dateFormatted = new Date(order.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    const totalFormatted = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const card = document.createElement('div');
    card.className = 'order-card';
    
    let productsHtml = '';
    order.items.forEach(item => {
      const itemTotal = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const unitPriceFormatted = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      
      let ratingBtnHtml = '';
      if (order.status === 'Entregue') {
        if (item.rating) {
          ratingBtnHtml = `
            <button class="btn-item-rate rated" disabled>
              <i data-lucide="star"></i> Avaliado (${item.rating}★)
            </button>
          `;
        } else {
          ratingBtnHtml = `
            <button class="btn-item-rate" onclick="openRatingModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
              <i data-lucide="star"></i> Avaliar Produto
            </button>
          `;
        }
      }
      
      productsHtml += `
        <div class="product-row">
          <div class="product-info-block">
            <div class="product-image-wrapper">
              <img src="${item.image_url}" alt="${item.name}">
            </div>
            <div class="product-details">
              <span class="product-tag">${item.category}</span>
              <h3 class="product-name">${item.name}</h3>
              <p class="product-description">${item.description || ''}</p>
            </div>
          </div>
          
          <div class="product-pricing-block">
            <div class="pricing-item">
              <span class="meta-label">Qtd / Unitário</span>
              <span class="price-sub">${item.quantity}x ${unitPriceFormatted}</span>
            </div>
            <div class="pricing-item">
              <span class="meta-label">Subtotal</span>
              <span class="price-total">${itemTotal}</span>
            </div>
            <div class="product-action-block">
              ${ratingBtnHtml}
            </div>
          </div>
        </div>
      `;
    });
    
    const orderDataEscaped = JSON.stringify(order).replace(/"/g, '&quot;');
    const itemsDataEscaped = JSON.stringify(order.items).replace(/"/g, '&quot;');
    
    card.innerHTML = `
      <div class="order-card-header">
        <div class="order-meta-info">
          <div class="meta-item">
            <span class="meta-label">Nº do Pedido</span>
            <span class="meta-value order-id-value">#MR-${order.id}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Data da Compra</span>
            <span class="meta-value">${dateFormatted}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Total Pago</span>
            <span class="meta-value order-total-value">${totalFormatted}</span>
          </div>
        </div>
        <div class="badge ${statusClass}">
          <span class="status-dot"></span> ${order.status}
        </div>
      </div>
      
      <div class="order-card-body">
        <div class="products-list">
          ${productsHtml}
        </div>
      </div>
      
      <div class="order-card-footer">
        <div class="footer-msg">
          <i data-lucide="shield-check"></i>
          <span>Compra garantida direto do produtor rural de Minas Gerais.</span>
        </div>
        <div class="order-global-actions">
          <button class="btn-track" onclick="openTrackingModal(${orderDataEscaped})">
            <i data-lucide="map"></i> Rastrear Entrega
          </button>
          <button class="btn-rebuy" onclick="triggerRebuy(${itemsDataEscaped})">
            <i data-lucide="refresh-cw"></i> Comprar Novamente
          </button>
          <button class="btn-delete-order" onclick="triggerDeleteOrder(${order.id})">
            <i data-lucide="trash-2"></i> Excluir
          </button>
        </div>
      </div>
    `;
    
    ordersGrid.appendChild(card);
  });
  
  lucide.createIcons();
}

/* ==========================================
   4. MODAIS E FORMULÁRIOS DE INTERAÇÃO
   ========================================== */

// Modal: Rastrear Entrega
window.openTrackingModal = function(order) {
  document.getElementById('modal-order-id').innerText = `Pedido #MR-${order.id}`;
  
  const modalBadge = document.getElementById('modal-status-badge');
  modalBadge.className = 'badge';
  
  let statusClass = 'badge-pending';
  if (order.status === 'Em Preparo') statusClass = 'badge-preparo';
  if (order.status === 'Em Trânsito') statusClass = 'badge-transito';
  if (order.status === 'Entregue') statusClass = 'badge-delivered';
  modalBadge.classList.add(statusClass);
  modalBadge.innerText = order.status;
  
  const trackingCodeText = document.getElementById('tracking-code-text');
  if (order.tracking_code) {
    trackingCodeText.innerText = order.tracking_code;
  } else {
    trackingCodeText.innerText = 'Não gerado';
  }

  const stepPayment = document.getElementById('step-payment');
  const stepPreparo = document.getElementById('step-preparo');
  const stepTransito = document.getElementById('step-transito');
  const stepEntregue = document.getElementById('step-entregue');
  
  const steps = [stepPayment, stepPreparo, stepTransito, stepEntregue];
  steps.forEach(step => {
    step.className = 'timeline-step';
  });
  
  if (order.status === 'Aguardando Pagamento') {
    stepPayment.classList.add('active');
  } else if (order.status === 'Em Preparo') {
    stepPayment.classList.add('completed');
    stepPreparo.classList.add('active');
  } else if (order.status === 'Em Trânsito') {
    stepPayment.classList.add('completed');
    stepPreparo.classList.add('completed');
    stepTransito.classList.add('active');
  } else if (order.status === 'Entregue') {
    stepPayment.classList.add('completed');
    stepPreparo.classList.add('completed');
    stepTransito.classList.add('completed');
    stepEntregue.classList.add('active');
  }
  
  trackingModal.classList.remove('hidden');
};

// Modal: Avaliar Produto
window.openRatingModal = function(item) {
  currentRatingItemId = item.id;
  selectedRatingValue = 0;
  
  document.getElementById('rating-product-name').innerText = item.name;
  document.getElementById('rating-product-img').src = item.image_url;
  document.getElementById('rating-product-category').innerText = item.category;
  document.getElementById('rating-product-desc').innerText = item.description || 'Delícia mineira autêntica selecionada na roça.';
  
  updateStarsDisplay(0);
  document.getElementById('rating-value-label').innerText = 'Selecione uma nota de 1 a 5 estrelas';
  document.getElementById('rating-comment').value = '';
  
  // Oculta erros
  document.getElementById('star-error').classList.add('hidden');
  document.getElementById('comment-error').classList.add('hidden');
  
  ratingModal.classList.remove('hidden');
};

// Lógica de Estrelas
const starButtons = document.querySelectorAll('.star-btn');
starButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = parseInt(btn.getAttribute('data-value'));
    selectedRatingValue = value;
    updateStarsDisplay(value);
    document.getElementById('star-error').classList.add('hidden'); // oculta erro de estrela
    
    const labels = {
      1: "Ruim: Uai, não gostei muito...",
      2: "Regular: Sabor razoável.",
      3: "Bom: Gostoso, um trem bão!",
      4: "Muito Bom: Uma delícia danada de boa!",
      5: "Excelente: O puro sabor do campo, perfeito!"
    };
    document.getElementById('rating-value-label').innerText = labels[value];
  });
});

function updateStarsDisplay(rating) {
  starButtons.forEach(btn => {
    const value = parseInt(btn.getAttribute('data-value'));
    if (value <= rating) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Ação de Recompra
window.triggerRebuy = function(orderItems) {
  const confirmText = "Você realmente deseja adicionar todas as delícias deste pedido de volta em um novo pedido no MySQL?";
  if (confirm(confirmText)) {
    requestRebuy(orderItems);
  }
};

// Fechar Modais
function closeModals() {
  trackingModal.classList.add('hidden');
  ratingModal.classList.add('hidden');
  buyFormModal.classList.add('hidden');
}

closeTrackingBtn.addEventListener('click', closeModals);
closeRatingBtn.addEventListener('click', closeModals);
closeBuyFormBtn.addEventListener('click', closeModals);

window.addEventListener('click', (e) => {
  if (e.target === trackingModal || e.target === ratingModal || e.target === buyFormModal) {
    closeModals();
  }
});

/* ==========================================
   5. VALIDAÇÃO DOS CAMPOS DE FORMULÁRIO (Sprint 4)
   ========================================== */

// 1. Ouvintes de Mudança nos campos do formulário para cálculo dinâmico e validações instantâneas
function setupFormValidationListeners() {
  
  // Abre o modal de formulário limpo
  btnOpenBuyForm.addEventListener('click', () => {
    simulatePurchaseForm.reset();
    qtyError.classList.add('hidden');
    couponFeedback.classList.add('hidden');
    notesError.classList.add('hidden');
    summaryDiscountRow.classList.add('hidden');
    
    charCounter.innerText = '0 / 150';
    charCounter.style.color = 'var(--color-text-muted)';
    
    updateFormPrices();
    buyFormModal.classList.remove('hidden');
  });

  // Atualização dinâmica ao trocar o produto
  formProductSelect.addEventListener('change', updateFormPrices);

  // Validação dinâmica de Quantidade (Regra de Negócio: inteiro de 1 a 10)
  formProductQty.addEventListener('input', () => {
    const qtyVal = parseFloat(formProductQty.value);
    
    if (isNaN(qtyVal) || !Number.isInteger(qtyVal) || qtyVal < 1 || qtyVal > 10) {
      qtyError.classList.remove('hidden');
      formProductQty.style.borderColor = '#D32F2F';
    } else {
      qtyError.classList.add('hidden');
      formProductQty.style.borderColor = 'var(--color-border)';
      updateFormPrices();
    }
  });

  // Validação dinâmica do Cupom de Desconto (Regra de Negócio: MINAS10 dá 10% de desconto)
  formProductCoupon.addEventListener('input', () => {
    const couponVal = formProductCoupon.value.trim().toUpperCase();
    if (couponVal === 'MINAS10') {
      couponFeedback.classList.remove('hidden');
    } else {
      couponFeedback.classList.add('hidden');
    }
    updateFormPrices();
  });

  // Validação dinâmica de tamanho de caracteres (Regra de Negócio: máximo 150 caracteres)
  formProductNotes.addEventListener('input', () => {
    const length = formProductNotes.value.length;
    charCounter.innerText = `${length} / 150`;

    if (length > 150) {
      notesError.classList.remove('hidden');
      charCounter.style.color = '#D32F2F';
      formProductNotes.style.borderColor = '#D32F2F';
    } else {
      notesError.classList.add('hidden');
      charCounter.style.color = 'var(--color-text-muted)';
      formProductNotes.style.borderColor = 'var(--color-border)';
    }
  });

  // Validação do campo de comentário de avaliação (Mínimo 10 caracteres se digitado)
  document.getElementById('rating-comment').addEventListener('input', () => {
    const textVal = document.getElementById('rating-comment').value.trim();
    if (textVal.length > 0 && textVal.length < 10) {
      document.getElementById('comment-error').classList.remove('hidden');
      document.getElementById('rating-comment').style.borderColor = '#D32F2F';
    } else {
      document.getElementById('comment-error').classList.add('hidden');
      document.getElementById('rating-comment').style.borderColor = 'var(--color-border)';
    }
  });
}

// Função para calcular e atualizar preços e cupons no resumo do formulário
function updateFormPrices() {
  const selectedOption = formProductSelect.options[formProductSelect.selectedIndex];
  const price = parseFloat(selectedOption.getAttribute('data-price'));
  const qty = parseInt(formProductQty.value) || 1;
  const coupon = formProductCoupon.value.trim().toUpperCase();

  const subtotalVal = price * qty;
  let discountVal = 0;

  if (coupon === 'MINAS10') {
    discountVal = subtotalVal * 0.10;
    summaryDiscountRow.classList.remove('hidden');
  } else {
    summaryDiscountRow.classList.add('hidden');
  }

  const totalVal = subtotalVal - discountVal;

  // Atualiza HTML formatando em R$
  summarySubtotal.innerText = subtotalVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  summaryDiscount.innerText = `- ${discountVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
  summaryTotal.innerText = totalVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// 2. SUBMIT DO FORMULÁRIO DE COMPRA COM VALIDAÇÃO COMPLETA
simulatePurchaseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Executa checagem de erros do formulário antes de enviar
  const selectedProductId = formProductSelect.value;
  const qtyVal = parseFloat(formProductQty.value);
  const couponVal = formProductCoupon.value.trim();
  const notesVal = formProductNotes.value;

  let hasErrors = false;

  // Valida Quantidade
  if (isNaN(qtyVal) || !Number.isInteger(qtyVal) || qtyVal < 1 || qtyVal > 10) {
    qtyError.classList.remove('hidden');
    formProductQty.style.borderColor = '#D32F2F';
    hasErrors = true;
  }

  // Valida Notas de Entrega
  if (notesVal.length > 150) {
    notesError.classList.remove('hidden');
    formProductNotes.style.borderColor = '#D32F2F';
    hasErrors = true;
  }

  // Se houver qualquer erro, impede o envio e avisa
  if (hasErrors) {
    alert("Por favor, corrija os erros de validação do formulário antes de enviar!");
    return;
  }

  // Envia a compra para o banco MySQL
  await submitNewPurchase(selectedProductId, qtyVal, couponVal);
});

// 3. VALIDAÇÃO DO SUBMIT DO FORMULÁRIO DE AVALIAÇÃO (Rating)
document.getElementById('btn-save-rating').replaceWith(
  document.getElementById('btn-save-rating').cloneNode(true)
);

document.getElementById('btn-save-rating').addEventListener('click', () => {
  const commentVal = document.getElementById('rating-comment').value.trim();
  let hasErrors = false;

  // Valida estrelas (Mínimo 1 estrela selecionada)
  if (selectedRatingValue === 0) {
    document.getElementById('star-error').classList.remove('hidden');
    hasErrors = true;
  } else {
    document.getElementById('star-error').classList.add('hidden');
  }

  // Valida Comentário (Mínimo 10 caracteres se preenchido)
  if (commentVal.length > 0 && commentVal.length < 10) {
    document.getElementById('comment-error').classList.remove('hidden');
    document.getElementById('rating-comment').style.borderColor = '#D32F2F';
    hasErrors = true;
  } else {
    document.getElementById('comment-error').classList.add('hidden');
  }

  if (hasErrors) {
    return;
  }

  submitRating(currentRatingItemId, selectedRatingValue, commentVal);
});

/* ==========================================
   6. OUVINTES DE EVENTOS (FILTROS E BUSCA)
   ========================================== */

function setupEventListeners() {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterAndRenderOrders();
  });
  
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      activeStatusFilter = pill.getAttribute('data-status');
      filterAndRenderOrders();
    });
  });
  
  btnClearFilters.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    activeStatusFilter = 'Todos';
    updateActiveFilterTab();
    filterAndRenderOrders();
  });
}

function updateActiveFilterTab() {
  filterPills.forEach(pill => {
    if (pill.getAttribute('data-status') === activeStatusFilter) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

/* ==========================================
   7. AUXILIARES DE INTERFACE (LOADER / TOAST)
   ========================================== */

function showLoader(show) {
  if (show) {
    loadingState.classList.remove('hidden');
    ordersGrid.classList.add('hidden');
    emptyState.classList.add('hidden');
  } else {
    loadingState.classList.add('hidden');
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.right = '30px';
  toast.style.backgroundColor = '#4A2C11';
  toast.style.color = '#FCFAF6';
  toast.style.padding = '16px 24px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 10px 30px rgba(74,44,17,0.3)';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '0.9rem';
  toast.style.fontWeight = '600';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';
  toast.style.borderLeft = '4px solid #C3935B';
  toast.style.transition = 'all 0.3s ease';
  toast.style.transform = 'translateY(100px)';
  toast.style.opacity = '0';
  
  toast.innerHTML = `<i data-lucide="check-circle" style="color: #C3935B; width: 18px; height: 18px;"></i> <span>${message}</span>`;
  
  document.body.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}
