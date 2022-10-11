import { menuArray } from "./data.js"

const content = document.getElementById('content')
const orderDetailsEl = document.getElementById('order-details')
let order = initializeOrder()

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

document.addEventListener('click', e => {
    if(e.target.dataset.add)
        addToCart(e.target.dataset.add)
    else if(e.target.dataset.remove)
        removeFromCart(e.target.dataset.remove)
    else if(e.target.id === "order-btn")
        handleOrderBtnClick()
})

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

function getItem(id){
    let newItem = order.filter( item => {
        return item.id === parseInt(id)
    } )[0]
    return newItem
}

function handleOrderBtnClick(){

}

function calculatePrice(){
    let price = 0
    for(let item of order){
        console.log('price: ', item.price, 'orders: ', item.orders)
        price += item.price*item.orders
        console.log(price)
    }
    console.log(price)
    return price
}

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
