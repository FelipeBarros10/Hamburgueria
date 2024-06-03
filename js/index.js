const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const cartFinished = document.getElementById("cart-modal-finished")
const btnFinished = document.getElementById("btn-close-finished") 

let cart = []


// Abrindo o modal
cartBtn.addEventListener("click", function (){
  updateCartModal()
  cartModal.style.display = "flex"
})
// Fim do abrindo modal


//Fechando Modal apertando fora dele
cartModal.addEventListener("click", function(event){
  if(event.target === cartModal){
    cartModal.style.display = "none"
  }
})
//Fim do fechando modal fora dele


// Fechando modal pelo btn "fechar"
closeModalBtn.addEventListener("click", function(event){
  if(event.target === closeModalBtn){
    cartModal.style.display = "none"
  }
})
// Fim do fechando o modal pelo btn "fechar"



menu.addEventListener("click", function(event){
  //Criando uma variável que recebeu um evento que puxou as "div´s" filhas da classe "add-to-cart-btn"
  parentButton = event.target.closest(".add-to-cart-btn")

  if(parentButton){
    name = parentButton.getAttribute("data-name")
    price = parseFloat(parentButton.getAttribute("data-price"))

    addToCart(name,price)
  }

})

// Função para adicionar no carrinho
function addToCart (name, price) {
  const existingItem = cart.find(item => item.name === name)
  
  if(existingItem){
    //Se o item já existe, aumenta a quantidade + 1
    existingItem.quantity += 1
  } else{
    cart.push({
      name,
      price,
      quantity: 1,
    })

  }

  updateCartModal()
 
}

//Função para atualizar o carrinho (Atualiza na inclusão e retirada de produtos)
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item =>{
    const cartItemElement = document.createElement("div")
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItemElement.innerHTML =`
      <div class="flex items-center justify-between">
        <div class="my-2">
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <div>
          <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
          </button>
        </div>
      </div>
    `

    total += item.price * item.quantity;
    
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length

}


//Continuar debugando daqui//

//Listener para identificar a classe e atributo do modal e para chamarva função de "remove"
cartItemsContainer.addEventListener("click", function (event){

  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

    removeItemCart(name)
  }

})


//Função para remover produto do carrinho
function removeItemCart (name){
  const index = cart.findIndex(item => item.name === name)
  
  if(index !== -1){
    const item = cart[index]
    
    if(item.quantity > 1){
      item.quantity -= 1
      updateCartModal()
    }else{
      cart.splice(index, 1)
      updateCartModal()
    }
    
  }

}

//Validando o campo de endereço

addressInput.addEventListener("input", function(event){
  let input = event.target.value

  if(input !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
  
})

// Validando o botão de finalização de pedido
checkoutBtn.addEventListener("click", function(){

  const isOpen = checkIfRestaurantIsOpen()

   if (!isOpen){
     alert("Restaurante fechado no momento!")
     return;
  }

  if(cart.length === 0){
    return;
  }
  
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
  } else{
    cartModal.style.display = "none"
  }

  // Enviar pedido para API do WhatsApp


  const cartItems = cart.map((item) => { // .MAP retorna um novo array,não substitui, apenas cria um novo, aplicando uma função para cada elemento
    return (` ${item.name} Quantidade: ${item.quantity} Preço: R$${item.price} |`) // Aqui está retornando a mensagem que será exibida, então estou pegando o nome, quantidade e preço do meu array de produtos
  }).join("")

  const message = encodeURIComponent(cartItems) //Encodificando a varíavel que vai receber a mensagem
  const phone = "14996101440"

  window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank") //URL da API do WhatsApp inserindo as variáveis que eu criei

  cart = [] // Limpando o Array

  openModalFinished()
  updateCartModal()

})

// Modal de finalização de pedidos
function openModalFinished(){
  cartFinished.style.display = "flex"
    
}

// Fechando o modal de finalização de pedidos
btnFinished.addEventListener("click", function(){
  cartFinished.style.display = "none"
})


//Função de para checar se o restaurante está aberto
function checkIfRestaurantIsOpen (){
  const data = new Date()
  const hora = data.getHours()

  if(hora >= 18 && hora < 22){
    return true
  }
}

//Aqui, se não estiver no horário de funcionamento estará vermelho, se sim, estará verde (Assim que fora carregado a janela essa verificção será feita)
const spanItem = document.getElementById("date-span")
const isOpen = checkIfRestaurantIsOpen()

if (isOpen){
  spanItem.classList.remove("bg-red-600")
  spanItem.classList.add("bg-green-600")
} else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-600")
}