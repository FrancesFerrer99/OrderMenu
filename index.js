import { menuArray } from "./data.js"

const content = document.getElementById('content')
const orderDetailsEl = document.getElementById('order-details')
const modalEl = document.getElementById('modal-checkout')
const starsReviewEl = document.getElementsByClassName('fa-star')

let order = initializeOrder()

document.addEventListener('click', e => {
    if(e.target.dataset.add)
        addToCart(e.target.dataset.add)
    else if(e.target.dataset.remove)
        removeFromCart(e.target.dataset.remove)
    else if(e.target.id === "order-btn")
        handleOrderBtnClick()
    else if(e.target.id === "close-modal")
        handleCloseModal()
    else if(e.target.dataset.index)
        handleReview(e.target.dataset.index)
})

document.addEventListener('submit', e => {
    e.preventDefault()
    handleFinalCheckout()
})

//event handlers
function addToCart(id){
    let targetItem = getItem(id)
    if(targetItem.orders === 0)
        document.getElementById(`remove-item-${id}`).disabled = false
    targetItem.orders++
    renderSum()
}

function removeFromCart(id){
    let targetItem = getItem(id)
    targetItem.orders--
    if(targetItem.orders === 0)
        document.getElementById(`remove-item-${id}`).disabled = true
    renderSum()
}

function handleOrderBtnClick(){
    let price = calculatePrice()
    if(!price){
        modalEl.innerHTML = `
            <h2>No item in cart</h2>
            <button id="close-modal">Return to order</button>
        `
    }
    else{
        document.getElementById('order-btn').disabled = true
        modalEl.innerHTML = `
            <form>
                <h2>Enter card details</h2>
                <label class="modal-label default-border-radius">Enter your name</label><br>
                <input type="text" placeholder="Enter your name" id="name" required /><br>
                <label class="modal-label default-border-radius">Enter card number</label><br>
                <input type="tel" placeholder="Enter card number" id="card" required /><br>
                <label class="modal-label default-border-radius">CVV</label><br>
                <input type="text" placeholder="cvv" id="cvv"required /><br>
                <button type="submit" class="order-btn default-border-radius" id="finish">Pay</button>
            </form>
            `
    }
    modalEl.classList.remove('hidden')
}

function handleFinalCheckout(){
    setTimeout(()=>{
        modalEl.innerHTML = `
        <div class="center-text">
            <img src="images/loading.svg" class="loading">
            <p id="upload-text">Please wait...</p>
        </div>
        `
    },1000)
    setTimeout(()=>{
        modalEl.innerHTML = `
            <h2>Leave a review</h2>
            <div class="review">
                <i class="fa-regular fa-star fa-xl" data-index="0"></i>
                <i class="fa-regular fa-star fa-xl" data-index="1"></i>
                <i class="fa-regular fa-star fa-xl" data-index="2"></i>
                <i class="fa-regular fa-star fa-xl" data-index="3"></i>
                <i class="fa-regular fa-star fa-xl" data-index="4"></i>
            </div>
        `
        orderDetailsEl.innerHTML = `
        <div class="default-border-radius default-padding finish-payment">
            <p>Thanks! Your order is on it's way!</p>
        </div>
        `
        document.getElementById('order-btn').disabled = false
    },3000)
    order = initializeOrder()
}

function handleCloseModal(){
    modalEl.classList.add('hidden')
}

function handleReview(index){
    let maxIndex = parseInt(index)+1
    for(let i = 0; i < maxIndex; i++){
        starsReviewEl[i].classList.add('reviewed')
    }
    setTimeout(()=>{
        modalEl.innerHTML = `
        <p>Thank you!</p>
        `
    },1500)
    setTimeout(()=>{
        handleCloseModal()
    },2500)
}

//utility functions
function initializeOrder(){
    let newOrder = menuArray.map( item => (
        {
            name: item.name,
            id: item.id,
            price: item.price,
            orders: 0
        }
    ))
    return newOrder
}
function getItem(id){
    let newItem = order.filter( item => {
        return item.id === parseInt(id)
    } )[0]
    return newItem
}

function calculatePrice(){
    let price = 0
    for(let item of order){
        price += item.price*item.orders
    }
    return price
}

//render related functions
function renderSum(){
    let orderHtml = ''
    let total = calculatePrice()
    for(let item of order){
        if(item.orders > 0){
            orderHtml += `
            <div class="checkout-item">
                <h2>${item.orders} ${item.name}: </h2>
                <h2>€${item.orders*item.price}</h2>
            </div>
            `        
        }
    }
    orderHtml += `
        <div class="checkout-item">
            <h2>Total price: </h2>
            <h2>€${total}</h2>
        </div>
    `
    orderDetailsEl.innerHTML = orderHtml
}

function getContentHtml(){
    let contentHtml = ''
    
    let iconElements = ['<i class="fa-solid fa-pizza-slice fa-2xl"></i>',
     '<i class="fa-solid fa-burger fa-2xl"></i>',
     '<i class="fa-solid fa-beer-mug-empty fa-2xl"></i>' ]

    let i = 0
    menuArray.forEach(item => {
        let itemDescripion = item.ingredients.join(",")
        contentHtml += `
            <div class="menu-item">
                ${iconElements[i]}
                <div>
                    <h2>${item.name}</h2>
                    <p>${itemDescripion}</p>
                    <h2>${item.price}</h2>
                </div>
                <div class="btn-container">
                    <button id="remove-item-${item.id}" class="add-item" data-remove="${item.id}" disabled><i class="fa-sharp fa-solid fa-minus"></i></button>
                    <button id="add-item-${item.id}" class="add-item" data-add="${item.id}"><i class="fa-regular fa-plus"></i></button>
                </div>
            </div>
        `
        i++
    });

    return contentHtml
}

function render(){
    content.innerHTML = getContentHtml()
}

render()