let carrinho = [];
let total = 0;
let pedidos = [];

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(item, preco) {
    carrinho.push({ item, preco });
    atualizarCarrinho();
}

// Função para atualizar o carrinho
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById('itens-carrinho');
    listaCarrinho.innerHTML = '';

    carrinho.forEach(({ item, preco }, index) => {
        const li = document.createElement('li');
        li.textContent = `${item} - R$${preco.toFixed(2)}`;
        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.onclick = () => removerDoCarrinho(index);
        li.appendChild(botaoRemover);
        listaCarrinho.appendChild(li);
    });

    total = carrinho.reduce((acc, { preco }) => acc + preco, 0);
    document.getElementById('total').textContent = `Total: R$${total.toFixed(2)}`;
}

// Função para remover item do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
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
        nomeCliente: nomeCliente,
        itens: carrinho.slice(),
        total: total
    };
    
    pedidos.push(pedido);

    // Salvar pedidos no localStorage
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    atualizarPedidos();

    carrinho = [];
    atualizarCarrinho();
}

// Função para atualizar a lista de pedidos
function atualizarPedidos() {
    const listaPedidos = document.getElementById('lista-pedidos');
    listaPedidos.innerHTML = '';

    // Recuperar pedidos do localStorage
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidosSalvos.forEach((pedido, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>Pedido ${index + 1} - Cliente: ${pedido.nomeCliente}</p>
            <ul>
                ${pedido.itens.map(({ item, preco }) => `<li>${item} - R$${preco.toFixed(2)}</li>`).join('')}
            </ul>
            <p>Total: R$${pedido.total.toFixed(2)}</p>
            <button onclick="concluirPedido(${index})">Concluir Pedido</button>
        `;
        listaPedidos.appendChild(li);
    });
}

// Função para concluir o pedido
function concluirPedido(index) {
    pedidos.splice(index, 1);
    localStorage.setItem('pedidos', JSON.stringify(pedidos)); // Atualiza o localStorage
    atualizarPedidos();
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
