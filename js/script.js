// ==========================================
// 1. ACESSIBILIDADE
// ==========================================
let tamanhoFonteAtual = 16; // Tamanho base

function mudarFonte(step) {
    tamanhoFonteAtual += (step * 2);
    // Muda o tamanho da fonte no elemento HTML para refletir no site inteiro (usando rem no CSS)
    document.documentElement.style.fontSize = tamanhoFonteAtual + "px";
}

function toggleContraste() {
    // Adiciona ou remove a classe "alto-contraste" do body
    document.body.classList.toggle('alto-contraste');
}

// ==========================================
// 2. FUNÇÃO DE FEEDBACK
// ==========================================
function mostrarMensagem(mensagem, tipo = 'bg-danger') {
    const toastEl = document.getElementById('meuToast');
    const toastBody = document.getElementById('toastMensagem');

    // Muda a cor do toast (vermelho para erro, verde para sucesso)
    toastEl.className = `toast align-items-center text-white ${tipo} border-0`;
    toastBody.innerText = mensagem;

    // Chama o Toast do Bootstrap
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// ==========================================
// 3. MÁSCARAS
// ==========================================
const celInput = document.getElementById('celular');
if (celInput) {
    celInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Tira tudo que não é número

        // Formata para (+55)XX-XXXXXXXXX
        if (value.length > 2 && value.length <= 4) {
            value = "(+55)" + value.substring(0);
        } else if (value.length > 4) {
            value = "(+55)" + value.substring(2, 4) + "-" + value.substring(4, 13);
        }
        e.target.value = value;
    });
}
const nomeInput = document.getElementById('nome');
if (nomeInput) {
    nomeInput.addEventListener('input', function (e) {
        // Tira tudo que não é letra ou espaço
        e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, "");
    });
}
const loginInput = document.getElementById('login');
if (loginInput) {
    loginInput.addEventListener('input', function (e) {
        // Tira tudo que não é letra
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
    });
}
const senhaInput = document.getElementById('senha');
if (senhaInput) {
    senhaInput.addEventListener('input', function (e) {
        // Tira tudo que não é letra
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
    });
}
const confirmaSenhaInput = document.getElementById('confirmaSenha');
if (confirmaSenhaInput) {
    confirmaSenhaInput.addEventListener('input', function (e) {
        // Tira tudo que não é letra
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
    });
}

// ==========================================
// 4. VALIDAÇÃO DO CADASTRO
// ==========================================
const formCadastro = document.getElementById('formCadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede a página de recarregar

        const nome = document.getElementById('nome').value.trim();
        const login = document.getElementById('login').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confSenha = document.getElementById('confirmaSenha').value.trim();
        const telefone = document.getElementById('celular').value.trim();

        // Regras (Expressões Regulares)
        const regexNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]{15,60}$/;
        const regexLogin = /^[A-Za-z]{6}$/;
        const regexSenha = /^[A-Za-z]{8}$/;

        // Validações
        if (!regexNome.test(nome)) {
            mostrarMensagem("Erro: O nome deve ter entre 15 e 60 caracteres alfabéticos.");
            return;
        }
        if (telefone.length < 17) { // Tamanho de (+55)XX-XXXXXXXXX
            mostrarMensagem("Erro: Preencha o telefone no formato correto.");
            return;
        }
        if (!regexLogin.test(login)) {
            mostrarMensagem("Erro: O login deve ter exatamente 6 caracteres alfabéticos.");
            return;
        }
        if (!regexSenha.test(senha)) {
            mostrarMensagem("Erro: A senha deve ter exatamente 8 caracteres alfabéticos.");
            return;
        }
        if (senha !== confSenha) {
            mostrarMensagem("Erro: As senhas não conferem.");
            return;
        }

        // Se passou em tudo, SALVA NO LOCALSTORAGE
        localStorage.setItem('usuarioLogin', login);
        localStorage.setItem('usuarioSenha', senha);
        localStorage.setItem('usuarioNome', nome);

        mostrarMensagem("Cadastro realizado com sucesso! Redirecionando...", "bg-success");

        // Espera 2 segundos e manda para a tela de login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}
// ==========================================
// 5. LÓGICA DE LOGIN E CRIAÇÃO DA SESSÃO
// ==========================================
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede a página de recarregar

        const loginDigitado = document.getElementById('loginAcesso').value.trim();
        const senhaDigitada = document.getElementById('senhaAcesso').value.trim();

        // Puxa os dados salvos na tela de Cadastro
        const loginSalvo = localStorage.getItem('usuarioLogin');
        const senhaSalva = localStorage.getItem('usuarioSenha');

        // Compara os dados
        if (loginDigitado === loginSalvo && senhaDigitada === senhaSalva) {
            // Cria uma "chave" no localStorage dizendo que o usuário está logado
            localStorage.setItem('usuarioLogado', 'sim');

            // Redireciona para a Vitrine (Tela 3)
            window.location.href = 'index.html';
        } else {
            mostrarMensagem("Login ou senha incorretos!", "bg-danger");
        }
    });
}
// ==========================================
// 6. CONTROLE DE SESSÃO NAS PÁGINAS DA LOJA
// ==========================================
function verificarSessao() {
    // Se ele está logado de verdade
    const estaLogado = localStorage.getItem('usuarioLogado');
    const nomeLogin = localStorage.getItem('usuarioLogin');

    // Se ESTÁ logado, coloca o nome dele em cima no menu e exibe botão de sair (ou oculta se não estiver)
    if (estaLogado === 'sim') {
        const spanNome = document.getElementById('nomeUsuarioLogado');
        if (spanNome) {
            spanNome.innerText = "Olá, " + nomeLogin;
        }
    } else {
        // Se NÃO está logado, oculta o botão de sair e o carrinho e manda para a página de cadastro clicando em comprar
        const botaoSair = document.querySelector('.botaoSair');
        botaoSair.style.display = 'none';
        const botaoCarrinho = document.querySelector('.botaoCarrinho');
        botaoCarrinho.style.display = 'none';
        const botaoCompra = document.querySelectorAll('.botaoCompra');
        botaoCompra.forEach(botao => {
            botao.addEventListener('click', function () {
                window.location.href = 'cadastro.html';
            });
            removerDoCarrinho(0);
        });
    }
}

// ==========================================
// 7. SAIR DA CONTA
// ==========================================
function fazerLogout() {
    // Remove SÓ o estado de logado (aí ele não perde a conta cadastrada)
    localStorage.removeItem('usuarioLogado');

    // Redireciona de volta para o login
    window.location.href = 'login.html';
}

// Executa a função toda vez que o script é carregado

// ==========================================
// 8. AUTOCOMPLETAR ENDEREÇOS
// ==========================================
const cepInput = document.getElementById('cep');

if (cepInput) {
    // Coloca a máscara de CEP enquanto o usuário digita (00000-000)
    cepInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Tira letras
        if (value.length > 5) {
            value = value.substring(0, 5) + "-" + value.substring(5, 8);
        }
        e.target.value = value;
    });

    // Quando o usuário sai do campo de CEP (clica fora ou aperta Tab)
    cepInput.addEventListener('blur', async function () {
        // Pega só os números
        const cepNumeros = cepInput.value.replace(/\D/g, "");

        // Só tenta buscar se o CEP tiver 8 números exatos
        if (cepNumeros.length === 8) {
            try {
                // Faz a requisição na API do ViaCEP
                const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
                const dados = await resposta.json();
                if (dados.erro) {
                    mostrarMensagem("CEP não encontrado", "bg-warning text-dark");
                    limparCamposEndereco();
                } else {
                    // Preenche os campos automaticamente com os IDs
                    document.getElementById('logradouro').value = dados.logradouro;
                    document.getElementById('bairro').value = dados.bairro;
                    document.getElementById('cidade').value = dados.localidade;
                    document.getElementById('estado').value = dados.uf;
                    document.getElementById('numero').focus();
                }
            } catch (erro) {
                mostrarMensagem("Erro ao tentar buscar o CEP.", "bg-danger");
            }
        } else if (cepNumeros.length > 0) {
            // Se ele digitou incompleto
            mostrarMensagem("CEP inválido.", "bg-danger");
            limparCamposEndereco();
        }
    });
}

// Limpar os campos se o usuário digitar errado no endereço
function limparCamposEndereco() {
    document.getElementById('logradouro').value = "";
    document.getElementById('bairro').value = "";
    document.getElementById('cidade').value = "";
    document.getElementById('estado').value = "";
}

// ==========================================
// 9. FILTRO DE CATEGORIAS (SUBMENU)
// ==========================================
function filtrarCategoria(categoriaEscolhida) {
    const grid = document.getElementById('gridProdutos');
    const todosProdutos = document.querySelectorAll('.produto-card');

    // Filtra os produtos
    todosProdutos.forEach(function (produto) {
        const categoriaDoProduto = produto.getAttribute('data-categoria');

        if (categoriaEscolhida === 'todas' || categoriaEscolhida === categoriaDoProduto) {
            produto.style.display = ''; // Respeita o display: flex do CSS
        } else {
            produto.style.display = 'none'; // Esconde o card
        }
    });

    // Desce a tela suavemente até as camisas
    if (grid) {
        grid.scrollIntoView({behavior: 'smooth'});
    }
}

// ==========================================
// 10. SISTEMA DE CARRINHO
// ==========================================
let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];

function adicionarAoCarrinho(nomeProduto, precoProduto) {
    // Adiciona o item na lista e salva na memória
    carrinho.push({nome: nomeProduto, preco: parseFloat(precoProduto)});
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));

    // Atualiza a tela primeiro antes de exibir a mensagem
    atualizarExibicaoCarrinho();

    // Exibe a notificação
    mostrarMensagem(`${nomeProduto} adicionado ao carrinho!`, 'bg-success');
}

function atualizarExibicaoCarrinho() {
    const lista = document.getElementById('listaCarrinho');
    const totalTexto = document.getElementById('totalCarrinho');

    // Pega todos os contadores do botão (com querySelectorAll para garantir)
    const qtds = document.querySelectorAll('#qtdCarrinho');

    // Atualiza a bolinha de quantidade no menu na mesma hora
    qtds.forEach(qtd => {
        qtd.innerText = carrinho.length;
    });

    // Para o carrinho se não tiver o botão na página
    if (!lista) return;

    // Atualiza os itens dentro do painel
    lista.innerHTML = '';
    let soma = 0;

    carrinho.forEach((item, index) => {
        soma += item.preco;
        lista.innerHTML += `
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div><h6 class="my-0" style="font-size: 0.9rem;">${item.nome}</h6></div>
                <div class="d-flex align-items-center">
                    <span class="text-muted me-2">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn btn-sm btn-outline-danger px-2 py-0" onclick="removerDoCarrinho(${index})">X</button>
                </div>
            </li>
        `;
    });

    if (totalTexto) {
        totalTexto.innerText = `R$ ${soma.toFixed(2).replace('.', ',')}`;
    }
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
    atualizarExibicaoCarrinho();
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarMensagem('Seu carrinho está vazio!', 'bg-warning text-dark');
        return;
    }

    // Limpa a lista e a memória
    carrinho = [];
    localStorage.removeItem('meuCarrinho');
    atualizarExibicaoCarrinho();

    mostrarMensagem('Compra finalizada com sucesso!', 'bg-success');

    // Fecha o menu lateral automaticamente
    const menuLateral = document.getElementById('carrinhoLateral');
    if (menuLateral) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(menuLateral);
        if (bsOffcanvas) bsOffcanvas.hide();
    }
}

// Quando a tela carregar, atualiza o carrinho (para os itens não sumirem)
document.addEventListener("DOMContentLoaded", function () {
    atualizarExibicaoCarrinho();
});
verificarSessao();
