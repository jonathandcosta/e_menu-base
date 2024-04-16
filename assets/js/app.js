$(document).ready(function () {
  cardapio.eventos.init(); // CHAMA A FUNÇÃO EVENTO
});

// MANIPULAR OS OBJETOS CRIADOS (CARDAPIO.EVENTOS - CARDAPIO.METODOS - CARDAPIO.TEMPLATES)
var cardapio = {};

var meu_Carrinho = [];

var valor_Carrinho = 0;
var valor_Entrega = 5.0;

cardapio.eventos = {
  init: () => {
    //INICIALIZAÇÃO
    cardapio.metodos.obterItensCardapio(); // CHAMA A FUNÇÃO METODO PARA CARREGAR OS ITENS
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

  // MENSAGEM APRESENTADA NO FRONT APÓS ADICIONAR O ITEM AO CARRINHO
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
      <div class="col-3 mb-5">
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
        <p class="price-produto"><b>R$\${preco}</b></p>
      </div>
      <div class="add-carrinho">
        <span class="btn-menos" onClick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')" ><i class="fas fa-minus"></i></span>
        <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
        <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')" ><i class="fas fa-plus"></i></span>
        <span class="btn btn-remove" onClick="cardapio.metodos.removerItemCarrinho('\${id}')" ><i class="fa fa-times"></i></span>
      </div>
  </div>
  `,
};
