let carrinho = [];
let total = 0;
let pedidos = [];

// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
    // Você obtém isso ao criar um projeto no Firebase Console
    apiKey: "sua-api-key-real",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-messaging-sender-id",
    appId: "seu-app-id"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Carregar pedidos do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    atualizarCarrinho();
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos = pedidosSalvos;
});

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(item, preco) {
    carrinho.push({ item, preco, quantidade: 1 });
    atualizarCarrinho();
}

// Função para atualizar o carrinho
function atualizarCarrinho() {
    const carrinhoDiv = document.getElementById('itens-carrinho');
    carrinhoDiv.innerHTML = '';
    total = 0;

    carrinho.forEach((produto, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrinho-item';
        
        itemDiv.innerHTML = `
            <div class="carrinho-item-info">
                <div>${produto.item}</div>
                <div>R$ ${(produto.preco * produto.quantidade).toFixed(2)}</div>
            </div>
            <div class="quantidade-controle">
                <button class="quantidade-btn" onclick="alterarQuantidade(${index}, -1)">-</button>
                <span>${produto.quantidade}</span>
                <button class="quantidade-btn" onclick="alterarQuantidade(${index}, 1)">+</button>
            </div>
        `;
        
        carrinhoDiv.appendChild(itemDiv);
        total += produto.preco * produto.quantidade;
    });

    document.querySelector('.total').textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Função para alterar quantidade
function alterarQuantidade(index, delta) {
    carrinho[index].quantidade += delta;
    
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    
    atualizarCarrinho();
}

// Função para fazer o pedido
function fazerPedido() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const nomeCliente = prompt('Digite o nome do cliente:');
    if (!nomeCliente) {
        alert('Por favor, insira o nome do cliente.');
        return;
    }
    
    const pedido = {
        id: Date.now(),
        nomeCliente: nomeCliente,
        itens: carrinho.map(item => ({
            item: item.item,
            preco: item.preco,
            quantidade: item.quantidade
        })),
        total: total,
        status: 'Pendente',
        horaPedido: new Date().toLocaleString()
    };
    
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    alert('Pedido realizado com sucesso!');
    carrinho = [];
    atualizarCarrinho();
}

// Função para atualizar a lista de pedidos (versão simplificada)
function atualizarPedidos() {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';

    pedidos.forEach((pedido, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="pedido-card ${pedido.status.toLowerCase()}">
                <h3>Pedido #${index + 1}</h3>
                <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
                <p><strong>Hora do Pedido:</strong> ${pedido.horaPedido}</p>
                <p><strong>Status:</strong> ${pedido.status}</p>
                <ul>
                    ${pedido.itens.map(({item, preco}) => 
                        `<li>${item} - R$${preco.toFixed(2)}</li>`).join('')}
                </ul>
                <p><strong>Total:</strong> R$${pedido.total.toFixed(2)}</p>
                <div class="status-buttons">
                    <button onclick="atualizarStatus(${pedido.id}, 'Em Preparo')">Em Preparo</button>
                    <button onclick="atualizarStatus(${pedido.id}, 'Saiu para Entrega')">Saiu para Entrega</button>
                    <button onclick="atualizarStatus(${pedido.id}, 'Entregue')">Entregue</button>
                </div>
            </div>
        `;
        listaPedidos.appendChild(li);
    });
}

// Função para atualizar status do pedido
function atualizarStatus(id, novoStatus) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        pedido.status = novoStatus;
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        atualizarPedidos();
    }
}

// Função para adicionar bebida
function adicionarBebida() {
    const bebidaSelecionada = document.querySelector('input[name="bebida"]:checked');
    if (!bebidaSelecionada) {
        alert('Selecione uma bebida.');
        return;
    }

    let precoBebida = 0;
    if (bebidaSelecionada.value === "Refrigerante") {
        precoBebida = 6;
    } else if (bebidaSelecionada.value === "Guaravita") {
        precoBebida = 2;
    }
    
    adicionarAoCarrinho(bebidaSelecionada.value, precoBebida);
}

// Função para adicionar item ao carrinho com exclusões
function adicionarAoCarrinhoComExclusoes(item, preco, formId) {
    const form = document.getElementById(formId);
    const exclusoes = [];
    
    form.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        exclusoes.push(checkbox.value);
    });

    let descricao = `${item} (Sem: ${exclusoes.join(', ')})`;
    adicionarAoCarrinho(descricao, preco);

// efeitos css

    document.addEventListener("DOMContentLoaded", function() {
        // Se você quiser manter o observer, mas não é necessário para animação ao hover
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                section.classList.add('animate'); // Adiciona a classe para ativar a animação
            });
    
            section.addEventListener('mouseleave', () => {
                section.classList.remove('animate'); // Remove a classe ao sair
            });
        });
    });
    
}

// Função para buscar pedido específico
function buscarPedido() {
    const numeroPedido = document.getElementById('numero-pedido').value;
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    
    if (numeroPedido > 0 && numeroPedido <= pedidos.length) {
        const pedido = pedidos[numeroPedido - 1];
        const statusPedido = document.getElementById('status-pedido');
        
        statusPedido.innerHTML = `
            <div class="pedido-status">
                <h3>Status do Pedido #${numeroPedido}</h3>
                <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
                <p><strong>Status:</strong> ${pedido.status}</p>
                <p><strong>Hora do Pedido:</strong> ${pedido.horaPedido}</p>
                <p><strong>Tempo Estimado:</strong> ${pedido.tempoEstimado}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${getProgressWidth(pedido.status)}%"></div>
                </div>
            </div>
        `;
    } else {
        alert('Pedido não encontrado!');
    }
}

// Função auxiliar para calcular progresso
function getProgressWidth(status) {
    switch(status) {
        case 'Pendente': return 25;
        case 'Em Preparo': return 50;
        case 'Saiu para Entrega': return 75;
        case 'Entregue': return 100;
        default: return 0;
    }
}

// Função para ouvir novos pedidos em tempo real
function iniciarMonitoramentoPedidos() {
    database.ref('pedidos').on('value', (snapshot) => {
        const pedidosData = snapshot.val();
        if (pedidosData) {
            pedidos = Object.values(pedidosData);
            atualizarPedidos();
        }
    });
}

// Iniciar monitoramento quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarMonitoramentoPedidos);

// Função para filtrar produtos por categoria
function filtrarCategoria(categoria) {
    const botoes = document.querySelectorAll('.categoria-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    
    const botaoSelecionado = document.querySelector(`.categoria-btn[data-categoria="${categoria}"]`);
    if (botaoSelecionado) {
        botaoSelecionado.classList.add('active');
    }

    const produtos = document.querySelectorAll('.produto-card');
    produtos.forEach(produto => {
        if (categoria === 'todos' || produto.dataset.categoria === categoria) {
            produto.style.display = 'block';
        } else {
            produto.style.display = 'none';
        }
    });
}

// Adicionar os event listeners para os botões de categoria
document.addEventListener('DOMContentLoaded', function() {
    const botoesCategorias = document.querySelectorAll('.categoria-btn');
    botoesCategorias.forEach(botao => {
        botao.addEventListener('click', () => {
            const categoria = botao.dataset.categoria;
            filtrarCategoria(categoria);
        });
    });
});
