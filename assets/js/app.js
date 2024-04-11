$(document).ready(function () {
  cardapio.eventos.init(); // CHAMA A FUNÇÃO EVENTO
});

// MANIPULAR OS OBJETOS CRIADOS (CARDAPIO.EVENTOS - CARDAPIO.METODOS - CARDAPIO.TEMPLATES)
var cardapio = {};

cardapio.eventos = {
  init: () => {
    //INICIALIZAÇÃO
    cardapio.metodos.obterItensCardapio(); // CHAMA A FUNÇÃO METODO PARA CARREGAR OS ITENS
  },
};

cardapio.metodos = {
  // OBTEM A LISTA COMPLETA DE ITENS DO CARDAPIO DO ARQUIVO DADOS
  obterItensCardapio: (categoria = 'burgers') => {
    // PASSANDO O PARAMETRO categoria, mas setada 'burgers' como a primeira pois é a primeira da lista
    var filtro = MENU[categoria]; // CHAMA O PARAMETRO 'categoria'
    console.log(filtro);

    $('#itensCardapio').html(''); // LIMPA A CADA NOVA CATEGORIA SELECIONADA SEM ACUMULAR

    // O "i" REPRESENTA O EACH "para cada", O "e" SIGNIFICA "elemento" NO ARQUIVO DADOS
    $.each(filtro, (i, e) => {
      let template = cardapio.templates.item // ESSA VARIAVEL CHAMA A FUNÇÃO TEMPLATES, PERMITE ADICIONAR NO HTML SUBSTITUINDO PELA PROPRIEDADE COM \${img} NA FUNÇÃO TEMPLATE
        // A FUNÇÃO .replace -> substiui X por Y EXEMPLO: .replace(/\${nome}/g, e.name) ESTA SUBSTITUINDO nome POR name
        .replace(/\${img}/g, e.img) // SUBSTITUINDO TODAS AS IMAGENS DE FORMA GLOBAL "todas"
        .replace(/\${nome}/g, e.name) // SUBSTITUINDO TODAS OS NOMES DE FORMA GLOBAL "todas"
        .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ',')); // SUBSTITUINDO TODAS OS PREÇOSS DE FORMA GLOBAL "todas"

      $('#itensCardapio').append(template); // ESSA LINHA É A AÇÃO QUE PERMITE ADICIONAR NO HTML IDENTIFICADA PELO TAG ID
    });

    // REMOVE O ATIVO SETADO inclusive o PADRÃO INICIAL 'burgers'
    $('.container-menu a').removeClass('active');

    // SETA A CATEGORIA SELECIONADA - ATIVANDO
    $('#menu-' + categoria).addClass('active');
  },
};

// O QUE SERÁ ESCRITO NO HTML
cardapio.templates = {
  item: `
      <div class="col-3 mb-5">
        <div class="card card-item">
          <div class="img-produto">
            <img src="\${img}" alt="">
          </div>
          <p class="title-produto text-center mt-4"><b>\${nome}</b></p>
          <p class="price-produto text-center"><b>R$\${preco}</b></p>
          <div class="add-carrinho">
              <span class="btn-menos"><i class="fas fa-minus"></i></span>
              <span class="add-numero-itens">0</span>
              <span class="btn-mais"><i class="fas fa-plus"></i></span>
              <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
          </div>
        </div>
      </div>
  `,
};
