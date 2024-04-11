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
  obterItensCardapio: () => {
    var filtro = MENU['burgers'];
    console.log(filtro);

    // O "i" REPRESENTA O EACH "para cada", O "e" SIGNIFICA "elemento" NO ARQUIVO DADOS
    $.each(filtro, (i, e) => {
      let template = cardapio.templates.item // ESSA VARIAVEL CHAMA A FUNÇÃO TEMPLATES, PERMITE ADICIONAR NO HTML SUBSTITUINDO PELA PROPRIEDADE COM \${img} NA FUNÇÃO TEMPLATE
        .replace(/\${img}/g, e.img) // SUBSTITUINDO TODAS AS IMAGENS DE FORMA GLOBAL "todas"
        .replace(/\${nome}/g, e.name) // SUBSTITUINDO TODAS OS NOMES DE FORMA GLOBAL "todas"
        .replace(/\${preco}/g, e.price); // SUBSTITUINDO TODAS OS PREÇOSS DE FORMA GLOBAL "todas"

      $('#itensCardapio').append(template); // ESSA LINHA É A AÇÃO QUE PERMITE ADICIONAR NO HTML IDENTIFICADA PELO TAG ID
    });
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
