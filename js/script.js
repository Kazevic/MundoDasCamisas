// ==========================================
// 1. ACESSIBILIDADE
// ==========================================
let tamanhoFonteAtual = 16; // Tamanho base

function mudarFonte(step) {
    tamanhoFonteAtual += (step * 2);
    // Muda o tamanho da fonte no elemento raiz (HTML) para refletir no site inteiro (usando rem no CSS)
    document.documentElement.style.fontSize = tamanhoFonteAtual + "px";
}

function toggleContraste() {
    // Adiciona ou remove uma classe "alto-contraste" do body
    document.body.classList.toggle('alto-contraste');
}

// ==========================================
// 2. FUNÇÃO DE FEEDBACK SEM ALERT
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
// 3. MÁSCARA DO TELEFONE
// ==========================================
const celInput = document.getElementById('celular');
if (celInput) {
    celInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Tira tudo que não é número

        // Formata para (+55)XX-XXXXXXXXX
        if (value.length > 2 && value.length <= 4) {
            value = "(+55)" + value.substring(2);
        } else if (value.length > 4) {
            value = "(+55)" + value.substring(2, 4) + "-" + value.substring(4, 13);
        }
        e.target.value = value;
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
        if (telefone.length < 17) { // Tamanho de (+55)XX-XXXXXXXX
            mostrarMensagem("Erro: Preencha o telefone no formato correto.");
            return;
        }
        if (!regexLogin.test(login)) {
            mostrarMensagem("Erro: O Login deve ter exatamente 6 caracteres alfabéticos.");
            return;
        }
        if (!regexSenha.test(senha)) {
            mostrarMensagem("Erro: A Senha deve ter exatamente 8 caracteres alfabéticos.");
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
// 4. LÓGICA DE LOGIN E CRIAÇÃO DA SESSÃO
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
            mostrarMensagem("Login ou Senha incorretos!", "bg-danger");
        }
    });
}
// ==========================================
// 5. CONTROLE DE SESSÃO NAS PÁGINAS DA LOJA
// ==========================================
function verificarSessao() {
    // Verifica qual página o usuário está acessando agora
    const urlAtual = window.location.pathname;

    // Se ele está logado de verdade
    const estaLogado = localStorage.getItem('usuarioLogado');
    const nomeLogin = localStorage.getItem('usuarioLogin');

    // Se NÃO está logado e NÃO está nas páginas de login/cadastro, expulsa pra tela de login
    if (estaLogado !== 'sim' && !urlAtual.includes('login.html') && !urlAtual.includes('cadastro.html')) {
        window.location.href = 'login.html';
    }

    // Se ESTÁ logado, coloca o nome dele em cima no menu e exibe botão de sair (ou oculta se não estiver)
    if (estaLogado === 'sim') {
        const spanNome = document.getElementById('nomeUsuarioLogado');
        if (spanNome) {
            spanNome.innerText = "Olá, " + nomeLogin;
        }
    } else {
        const botaoSair = document.querySelector('.botaoSair');
        botaoSair.style.display = 'none';
    }
}

// ==========================================
// 6. SAIR DA CONTA
// ==========================================
function fazerLogout() {
    // Remove APENAS o status de logado (assim ele não perde a conta que cadastrou)
    localStorage.removeItem('usuarioLogado');

    // Redireciona de volta para o login
    window.location.href = 'login.html';
}

// Executa a função toda vez que o script é carregado

// ==========================================
// 7. AUTOCOMPLETAR ENDEREÇOS
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
// 8. FILTRO DE CATEGORIAS (SUBMENU)
// ==========================================
function filtrarCategoria(categoriaEscolhida) {
    const todosProdutos = document.querySelectorAll('.produto-card');

    // Passa por cada produto verificando a categoria
    todosProdutos.forEach(function(produto) {

        // Pega a categoria do produto específico pela data-categoria
        const categoriaDoProduto = produto.getAttribute('data-categoria');

        // Se a pessoa clicou em "todas" OU se a categoria do produto for igual à escolhida no menu
        if (categoriaEscolhida === 'todas' || categoriaEscolhida === categoriaDoProduto) {
            produto.style.display = 'block';
        } else {
            produto.style.display = 'none';
        }

    });
}
verificarSessao();