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