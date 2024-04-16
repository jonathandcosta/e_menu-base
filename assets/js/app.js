$(document).ready(function () {
  cardapio.eventos.init(); // CHAMA A FUNÇÃO EVENTO
});

// MANIPULAR OS OBJETOS CRIADOS (CARDAPIO.EVENTOS - CARDAPIO.METODOS - CARDAPIO.TEMPLATES)
var cardapio = {};

var meu_Carrinho = [];
var meu_Endereco = null;

var valor_Carrinho = 0;
var valor_Entrega = 5.0;

var celular_Empresa = '5584999043539';

cardapio.eventos = {
  init: () => {
    //INICIALIZAÇÃO
    cardapio.metodos.obterItensCardapio(); // CHAMA A FUNÇÃO METODO PARA CARREGAR OS ITENS
    cardapio.metodos.carregaBotaoLigar();
    cardapio.metodos.carregaBotaoReserva(); // CHAMA A FUNÇÃO METODO PARA CARREGAR O BOTÃO RESERVA
  },
};

cardapio.metodos = {
  // OBTEM A LISTA COMPLETA DE ITENS DO CARDAPIO DO ARQUIVO DADOS
  obterItensCardapio: (categoria = 'burgers', vermais = false) => {
    // PASSANDO O PARAMETRO categoria, mas setada 'burgers' como a primeira pois é a primeira da lista
    var filtro = MENU[categoria]; // CHAMA O PARAMETRO 'categoria'
    console.log(filtro);

    if (!vermais) {
      $('#itensCardapio').html(''); // LIMPA A CADA NOVA CATEGORIA SELECIONADA SEM ACUMULAR
      $('#btnVerMais').removeClass('hidden'); // SE CLIQUEI EM UMA OUTRA CATEGORIA REMOVO A CLASSA 'hidden'
    }

    // O "i" REPRESENTA O "index" (EACH "para cada"), O "e" SIGNIFICA "elemento" NO ARQUIVO DADOS
    $.each(filtro, (i, e) => {
      let template = cardapio.templates.item // ESSA VARIAVEL CHAMA A FUNÇÃO TEMPLATES, PERMITE ADICIONAR NO HTML SUBSTITUINDO PELA PROPRIEDADE COM \${img} NA FUNÇÃO TEMPLATE
        // A FUNÇÃO .replace -> substiui X por Y EXEMPLO: .replace(/\${nome}/g, e.name) ESTA SUBSTITUINDO nome POR name
        .replace(/\${img}/g, e.img) // SUBSTITUINDO TODAS AS IMAGENS DE FORMA GLOBAL "todas"
        .replace(/\${nome}/g, e.name) // SUBSTITUINDO TODAS OS NOMES DE FORMA GLOBAL "todas"
        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ',')) // SUBSTITUINDO TODAS OS PREÇOSS DE FORMA GLOBAL "todas"
        .replace(/\${id}/g, e.id); // IDENTIFICANDO O PRODUTO PELO "id"

      // BOTÃO VER MAIS (MOSTRAR MAIS QUE 8 ITENS)
      if (vermais && i >= 8 && i < 12) {
        $('#itensCardapio').append(template); // ESSA LINHA É A AÇÃO QUE PERMITE ADICIONAR NO HTML IDENTIFICADA PELO TAG ID
      }

      // BOTÃO VER MAIS PAGINAÇÃO INICIAL - MOSTRA APENAS 8
      if (!vermais && i < 8) {
        $('#itensCardapio').append(template); // ESSA LINHA É A AÇÃO QUE PERMITE ADICIONAR NO HTML IDENTIFICADA PELO TAG ID
      }
    });

    // REMOVE O ATIVO SETADO inclusive o PADRÃO INICIAL 'burgers'
    $('.container-menu a').removeClass('active');

    // SETA A CATEGORIA SELECIONADA - ATIVANDO
    $('#menu-' + categoria).addClass('active');
  },

  // CLIQUE NO BOTÃO VER MAIS
  verMais: () => {
    var ativo = $('.container-menu a.active').attr('id').split('menu-')[1]; // IDENTIFICA CATEGORIA ATIVA PELO ID QUEBRANDO O ID ALTERADO
    cardapio.metodos.obterItensCardapio(ativo, true); //

    $('#btnVerMais').addClass('hidden'); // APÓS ACIONAR O BOTÃO "vermais" ELE FICA OCULTO USANDO A CLASS HIDDEN NO CSS
  },

  // DIMINUIR QUANTIDADE CARD DO PRODUTO
  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($('#qntd-' + id).text());

    if (qntdAtual > 0) {
      $('#qntd-' + id).text(qntdAtual - 1);
    }
  },

  // AUMENTAR QUANTIDADE CARD DO PRODUTO
  aumentarQuantidade: (id) => {
    let qntdAtual = parseInt($('#qntd-' + id).text());
    $('#qntd-' + id).text(qntdAtual + 1);
  },

  // ADICIONAR QUANTIDADE DE ITENS AO CARRINHO
  adicionarAoCarrinho: (id) => {
    let qntdAtual = parseInt($('#qntd-' + id).text());

    if (qntdAtual > 0) {
      // SABER A CATEGORIA QUE ESTÁ ATIVA
      var categoriaAtiva = $('.container-menu a.active')
        .attr('id')
        .split('menu-')[1];

      // OBTER A LISTA DE ITENS
      let filtro = MENU[categoriaAtiva];

      // OBTEM O ITEM
      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });

      if (item.length > 0) {
        // VALIDA SE JÁ EXISTE ESSE ITEM NO CARRINHO
        let existe = $.grep(meu_Carrinho, (elem, index) => {
          return elem.id == id;
        });

        // CASO EXISTA O ITEM NO CARRINHO, SÓ ALTERA A QUANTIDADE
        if (existe.length > 0) {
          let objIndex = meu_Carrinho.findIndex((obj) => obj.id == id);
          meu_Carrinho[objIndex].qntd = meu_Carrinho[objIndex].qntd + qntdAtual;
        }

        // CASO AINDA NÃO EXISTA O ITEM NO CARRINHO, ADICIONE O ITEM
        else {
          item[0].qntd = qntdAtual;
          meu_Carrinho.push(item[0]);
        }

        // MENSAGEM DE SUCESSO!
        cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
        $('#qntd-' + id).text(0); // LIMPA O NUMERO APÓS ADICIONAR O ITEM AO CARRINHO

        cardapio.metodos.atualizaBadgeTotal();
      }
    }
  },

  // ATUALIZA O BADGE DE TOTAL DE ITEM NO CARRINHO "meu carrinho"
  atualizaBadgeTotal: () => {
    var total = 0;

    $.each(meu_Carrinho, (i, e) => {
      total += e.qntd;
    });

    // MUDA AS CLASSES MANTENDO OU NÃO AS TAGS NO "html" OCULTAS
    if (total > 0) {
      $('.botao-carrinho').removeClass('hidden');
      $('.container-total-carrinho').removeClass('hidden');
    } else {
      $('.botao-carrinho').addClass('hidden');
      $('.container-total-carrinho').addClass('hidden');
    }

    $('.badge-total-carrinho').html(total);
  },

  // ABRIR A MODAL DE CARRINHO
  abrirCarrinho: (abrir) => {
    if (abrir) {
      $('#modalCarrinho').removeClass('hidden');
      cardapio.metodos.carragarCarrinho();
    } else {
      $('#modalCarrinho').addClass('hidden');
    }
  },

  //ALTERA OS TEXTOS E OS BOTÔES DAS ETAPAS
  carregaEtapas: (etapa) => {
    if (etapa == 1) {
      $('#iblTituloEtapa').text('Seu carrinho:');
      $('#itensCarrinho').removeClass('hidden');
      $('#localEntrega').addClass('hidden');
      $('#resumoCarrinho').addClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');

      $('#btnEtapaPedido').removeClass('hidden');
      $('#btnEtapaEndereco').addClass('hidden');
      $('#btnEtapaResumo').addClass('hidden');
      $('#btnVoltar').addClass('hidden');
    }
    if (etapa == 2) {
      $('#iblTituloEtapa').text('endereço de entrega:');
      $('#itensCarrinho').addClass('hidden');
      $('#localEntrega').removeClass('hidden');
      $('#resumoCarrinho').addClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');
      $('.etapa2').addClass('active');

      $('#btnEtapaPedido').addClass('hidden');
      $('#btnEtapaEndereco').removeClass('hidden');
      $('#btnEtapaResumo').addClass('hidden');
      $('#btnVoltar').removeClass('hidden');
    }
    if (etapa == 3) {
      $('#iblTituloEtapa').text('Resumo do pedido:');
      $('#itensCarrinho').addClass('hidden');
      $('#localEntrega').addClass('hidden');
      $('#resumoCarrinho').removeClass('hidden');

      $('.etapa').removeClass('active');
      $('.etapa1').addClass('active');
      $('.etapa2').addClass('active');
      $('.etapa3').addClass('active');

      $('#btnEtapaPedido').addClass('hidden');
      $('#btnEtapaEndereco').addClass('hidden');
      $('#btnEtapaResumo').removeClass('hidden');
      $('#btnVoltar').removeClass('hidden');
    }
  },

  // BOTÃO VOLTAR
  voltarEtapa: () => {
    let etapa = $('.etapa.active').length;
    cardapio.metodos.carregaEtapas(etapa - 1);
  },

  // CARREGANDO CARRINHO
  carragarCarrinho: () => {
    cardapio.metodos.carregaEtapas(1);

    if (meu_Carrinho.length > 0) {
      $('#itensCarrinho').html(''); // LIMPA PARA CARREGAR DEPOIS

      $.each(meu_Carrinho, (i, e) => {
        let temp = cardapio.templates.itemCarrinho
          .replace(/\${img}/g, e.img) // SUBSTITUINDO TODAS AS IMAGENS DE FORMA GLOBAL "todas"
          .replace(/\${nome}/g, e.name) // SUBSTITUINDO TODAS OS NOMES DE FORMA GLOBAL "todas"
          .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ',')) // SUBSTITUINDO TODAS OS PREÇOSS DE FORMA GLOBAL "todas"
          .replace(/\${id}/g, e.id)
          .replace(/\${qntd}/g, e.qntd);

        $('#itensCarrinho').append(temp);

        //ULTIMO ITEM
        if (i + 1 == meu_Carrinho.length) {
          cardapio.metodos.carregarValores();
        }
      });
    } else {
      $('#itensCarrinho').html(
        '<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho esta vazio</p>',
      );
      cardapio.metodos.carregarValores();
    }
  },

  // DIMINUI A QUANTIDADE NO CARRINHO
  diminuirQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($('#qntd-carrinho-' + id).text());

    if (qntdAtual > 1) {
      $('#qntd-carrinho-' + id).text(qntdAtual - 1);
      cardapio.metodos.atualizaCarrinho(id, qntdAtual - 1);
    } else {
      cardapio.metodos.removerItemCarrinho(id);
    }
  },

  // AUMENTA A QUANTIDADE NO CARRINHO ------------------------
  aumentarQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($('#qntd-carrinho-' + id).text());

    $('#qntd-carrinho-' + id).text(qntdAtual + 1);
    cardapio.metodos.atualizaCarrinho(id, qntdAtual + 1);
  },

  // BOTÃO REMOVER ITEM NO CARRINHO ------------------------
  removerItemCarrinho: (id) => {
    meu_Carrinho = $.grep(meu_Carrinho, (e, i) => {
      return e.id != id;
    });
    cardapio.metodos.carragarCarrinho();

    cardapio.metodos.atualizaBadgeTotal(); //ATUALIZA O BOTÃO FLUTUANTE  DO CARRINHO COM A QUANTIDADE ATUALIZADA
  },

  //ATUALIZA O CARRINHO COM A QUANTIDADE ATUAL ------------------------
  atualizaCarrinho: (id, qntd) => {
    let objIndex = meu_Carrinho.findIndex((obj) => obj.id == id);
    meu_Carrinho[objIndex].qntd = qntd;

    cardapio.metodos.atualizaBadgeTotal(); //ATUALIZA O BOTÃO FLUTUANTE  DO CARRINHO COM A QUANTIDADE ATUALIZADA

    cardapio.metodos.carregarValores();
  },

  //CARREGA O SUBTOTAL, ENTREGA E TOTAL NO FOOTER DO CARRINHO
  carregarValores: () => {
    valor_Carrinho = 0;

    $('#iblSubTotal').text('R$ 0,00');
    $('#iblValorEntrega').text('+ R$ 0,00');
    $('#iblValorTotal').text('R$ 0,00');

    $.each(meu_Carrinho, (i, e) => {
      valor_Carrinho += parseFloat(e.price * e.qntd);

      if (i + 1 == meu_Carrinho.length) {
        $('#iblSubTotal').text(
          `R$ ${valor_Carrinho.toFixed(2).replace('.', ',')}`,
        );
        $('#iblValorEntrega').text(
          `+ R$ ${valor_Entrega.toFixed(2).replace('.', ',')}`,
        );
        $('#iblValorTotal').text(
          `R$ ${(valor_Carrinho + valor_Entrega).toFixed(2).replace('.', ',')}`,
        );
      }
    });
  },

  // CARREGA A ETAPA DE ENDEREÇO
  carregarEndereco: () => {
    if (meu_Carrinho.length <= 0) {
      cardapio.metodos.mensagem('Seu carrinho está vazio.');
      return;
    }

    cardapio.metodos.carregaEtapas(2);
  },

  //  API VIACEP
  buscaCep: () => {
    // CRIA A VARIAVEL COM O VALOR DO CEP
    var cep = $('#txtCEP').val().trim().replace(/\D/g, ''); // VALIDA OS DADOS E LIMPA, DEIXANDO SEM (. , -)

    // VERIFICA SE O CEP FOI INFORMADO PELO USUÁRIO
    if (cep != '') {
      //EXPRESSÃO REGULAR PARA VALIDAR O CEP
      var validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        $.getJSON(
          'https://viacep.com.br/ws/' + cep + '/json/?callback=?',
          function (dados) {
            if (!('erro' in dados)) {
              // ATUALIZA OS CAMPOS COM OS VALORES RETORNADOS DA API
              $('#txtEndereco').val(dados.logradouro);
              $('#txtBairro').val(dados.bairro);
              $('#txtNumero').focus();
              $('#txtCidade').val(dados.localidade);
              $('#ddlUf').val(dados.uf);
            } else {
              cardapio.metodos.mensagem(
                'CEP não encontrado, Presencha as informações manualmente.',
              );
              $('#txtCEP').focus();
            }
          },
        );
      } else {
        cardapio.metodos.mensagem('Formato do CEP inválido.');
        $('#txtCEP').focus();
      }
    } else {
      cardapio.metodos.mensagem('Por favor, informe o seu CEP.');
      $('#txtCEP').focus();
    }
  },

  // RESUMO DO PEDIDO - VALIDAÇÃO DOS CAMPOS
  resumoPedido: () => {
    let cep = $('#txtCEP').val().trim();
    let endereco = $('#txtEndereco').val().trim();
    let bairro = $('#txtBairro').val().trim();
    let cidade = $('#txtCidade').val().trim();
    let uf = $('#ddlUf').val().trim();
    let numero = $('#txtNumero').val().trim();
    let complemento = $('#txtComplemento').val().trim();

    if (cep.length <= 0) {
      cardapio.metodos.mensagem('Informe o CEP por favor.');
      $('#txtCEP').focus();
      return;
    }
    if (endereco.length <= 0) {
      cardapio.metodos.mensagem('Informe o endereço por favor.');
      $('#txtEndereco').focus();
      return;
    }
    if (bairro.length <= 0) {
      cardapio.metodos.mensagem('Informe o bairro por favor.');
      $('#txtBairro').focus();
      return;
    }
    if (cidade.length <= 0) {
      cardapio.metodos.mensagem('Informe a cidade por favor.');
      $('#txtCidade').focus();
      return;
    }
    if (uf == '-1') {
      cardapio.metodos.mensagem('Informe a UF por favor.');
      $('#ddlUf').focus();
      return;
    }
    if (numero.length <= 0) {
      cardapio.metodos.mensagem('Informe o número por favor.');
      $('#txtNumero').focus();
      return;
    }

    meu_Endereco = {
      cep: cep,
      endereco: endereco,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      numero: numero,
      complemento: complemento,
    };

    cardapio.metodos.carregaEtapas(3);
    cardapio.metodos.carregaResumo();
  },

  // CARREGA A ETAPA DE RESUMO DO PEDIDO
  carregaResumo: () => {
    $('#listaItensResumo').html('');

    $.each(meu_Carrinho, (i, e) => {
      let temp = cardapio.templates.itemResumo
        .replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.name)
        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
        .replace(/\${qntd}/g, e.qntd);

      $('#listaItensResumo').append(temp);
    });

    $('#resumoEndereco').html(
      `${meu_Endereco.endereco}, ${meu_Endereco.numero} <br/> ${meu_Endereco.bairro}`,
    );
    $('#cidadeEndereco').html(
      `${meu_Endereco.cidade} - ${meu_Endereco.uf}, ${meu_Endereco.cep} <br/> ${meu_Endereco.complemento}`,
    );

    cardapio.metodos.finalizarPedido();
  },

  // ATUALIZA O BOTÃO FINALIZAR PEDIDO COM O LINK DO WHATSAPP
  finalizarPedido: () => {
    if (meu_Carrinho.length > 0 && meu_Endereco != null) {
      var texto = 'Olá! Gostaria de fazer um pedido:';
      texto += `\n*Itens do pedido:*\n\n\${itens}`;
      texto += `\n*Endereço de entrega:*`;
      texto += `\n${meu_Endereco.endereco}, ${meu_Endereco.numero} \n ${meu_Endereco.bairro}`;
      texto += `\n${meu_Endereco.cidade} - ${meu_Endereco.uf}, ${meu_Endereco.cep} \n ${meu_Endereco.complemento}`;
      texto += `\n\n*Total (com entrega): R$ ${(valor_Carrinho + valor_Entrega)
        .toFixed(2)
        .replace('.', ',')}*`;

      var itens = '';

      $.each(meu_Carrinho, (i, e) => {
        itens += `* ${e.qntd}x* ${e.name} ....... R$ ${e.price
          .toFixed(2)
          .replace('.', ',')} \n`;

        // último item
        if (i + 1 == meu_Carrinho.length) {
          texto = texto.replace(/\${itens}/g, itens);

          //  CONVERTE A URL COMPATIVEL COM O NAVEGADOR
          let encode = encodeURI(texto);
          let URL = `https://wa.me/${celular_Empresa}?text=${encode}`;

          $('#btnEtapaResumo').attr('href', URL);
        }
      });
    }
  },

  // CARREGA O LINK DO BOTÃO RESERVA
  carregaBotaoReserva: () => {
    var texto = 'Olá! Gostaria de fazer uma *reserva*';

    let encode = encodeURI(texto);
    let URL = `https://wa.me/${celular_Empresa}?text=${encode}`;

    $('#btnReserva').attr('href', URL);
  },

  // CARREGA BOTÃO LIGAR
  carregaBotaoLigar: () => {
    $('#btnLigar').attr('href', `tel:${celular_Empresa}`);
  },

  // ABRIR DEPOIMENTO
  abrirDepoimento: (depoimento) => {
    $('#depoimento-1').addClass('hidden');
    $('#depoimento-2').addClass('hidden');
    $('#depoimento-3').addClass('hidden');

    $('#btnDepoimento-1').removeClass('active');
    $('#btnDepoimento-2').removeClass('active');
    $('#btnDepoimento-3').removeClass('active');

    $('#depoimento-' + depoimento).removeClass('hidden');
    $('#btnDepoimento-' + depoimento).addClass('active');
  },

  // MENSAGEM APRESENTADA NO FRONT APÓS ADICIONAR OU REMOVER OU NÃO TER ITEM AO CARRINHO
  mensagem: (texto, cor = 'red', tempo = 3500) => {
    // APAGANDO A MENSAGEM DE SUCESSO APÓS 3,5 SEG
    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $('#container-mensagens').append(msg);

    setTimeout(() => {
      $('#msg-' + id).removeClass('fadeInDown');
      $('#msg-' + id).addClass('fadeOutUp');
      setTimeout(() => {
        $('#msg-' + id).remove();
      }, 800);
    }, tempo);
  },
};

// O QUE SERÁ ESCRITO NO HTML
cardapio.templates = {
  item: `
      <div class="col-3 mb-5 animated fadeInUp">
        <div class="card card-item" id="\${id}">
          <div class="img-produto">
            <img src="\${img}" alt="">
          </div>
          <p class="title-produto text-center mt-4"><b>\${nome}</b></p>
          <p class="price-produto text-center"><b>R$\${preco}</b></p>
          <div class="add-carrinho">
              <span class="btn-menos" onClick="cardapio.metodos.diminuirQuantidade('\${id}')" ><i class="fas fa-minus"></i></span>
              <span class="add-numero-itens" id="qntd-\${id}">0</span>
              <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidade('\${id}')" ><i class="fas fa-plus"></i></span>
              <span class="btn btn-add" onClick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
          </div>
        </div>
      </div>
  `,

  itemCarrinho: `
      <div class="col-12 item-carrinho">
        <div class="img-produto">
          <img src="\${img}" alt="">
        </div>
        <div class="dados-produto">
          <p class="title-produto"><b>\${nome}</b></p>
          <p class="price-produto"><b>R$ \${preco}</b></p>
        </div>
        <div class="add-carrinho">
          <span class="btn-menos" onClick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')" ><i class="fas fa-minus"></i></span>
          <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
          <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')" ><i class="fas fa-plus"></i></span>
          <span class="btn btn-remove" onClick="cardapio.metodos.removerItemCarrinho('\${id}')" ><i class="fa fa-times"></i></span>
        </div>
      </div>
  `,

  itemResumo: `
      <div class="col-12 item-carrinho resumo">
        <div class="img-produto-resumo">
          <img src="\${img}" alt="">
        </div>
        <div class="dados-produto">
          <p class="title-produto-resumo">
            <b>\${nome}</b>
          </p>
          <p class="price-produto-resumo">
            <b>R$ \${preco}</b>
          </p>
        </div>
        <p class="quantidade-produto-resumo">
          x <b>\${qntd}</b>
        </p>
      </div>
  `,
};
