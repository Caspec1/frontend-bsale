let cart = []
console.log(cart)

window.onload = async () => {
    const [category, products] = await Promise.all([
        getCategory(),
        getProducts()
    ])

    createAsideHTML(category)
    createMainHTML(products)
}

function toggleMenu() {
    const aside = document.querySelector('.aside')
    aside.classList.toggle('toggle')
}

function closeModal() {
    const aside = document.querySelector('.aside')
    aside.classList.remove('toggle')
}

async function getCategory() {
    const url = 'http://localhost:3000/api/category'
    const res = await fetch(url)
    products = await res.json()
    return products
}

async function getProducts() {
    const url = 'http://localhost:3000/api/products'
    const res = await fetch(url)
    const result = await res.json()

    return result
}

form.addEventListener('submit', async function(e) {
    e.preventDefault()

    const select = parseInt(document.querySelector('#select-form').value)
    const text = document.querySelector('#text').value
    
    const data = {category: select, search: text}

    const url = 'http://localhost:3000/api/products'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const result = await response.json();

    createMainHTML(result)
})

function createAsideHTML(category) {

    const aside = document.querySelector('#select-form')

    const html = `
        <option value="0">Todas</option>
        ${category.map(cat => `<option value=${cat.id} name="category">${cat.name}</option>`)}
    `

    aside.innerHTML = html
}

const addCart = (prod) => {
    const id = prod.getAttribute('value')
    const name = prod.getAttribute('name')
    const image = prod.getAttribute('url')
    const price = prod.getAttribute('price')
    const discount = prod.getAttribute('discount')
    const newPrice = prod.getAttribute('new-price')

    const product = {
        id,
        name,
        image,
        price,
        discount,
        newPrice
    }

    return cart = [...cart, product]
}

function createMainHTML(products) {

    const main = document.querySelector('main')

    const html = `
        ${products.map(prod => {
            const {id, name, price, discount, url_image} = prod

            const newPrice = price - discount

            return (
                `
                <div class="card">
                    <img src=${url_image} alt=${name} class="card__image"/>
                    <div class="card__content">
                        <h2 class="card__title">${name}</h2>
                        <div class="card__prices">
                            <p class=${discount !== 0 ? 'card__discount' : 'card__price'}>$ ${price}</p>
                            <p class='card__price'>${discount !== 0 ? `$ ${newPrice}` : ''}</p>
                        </div>
                        <button type="button" class='card__add-cart' id="button-cart" value=${id} price=${price} name=${name} url=${url_image} discount=${discount} new-price=${newPrice} onclick="addCart(this)">Agregar al carrito</button>
                    </div>
                </div>
            `
            )
            
        }).join('')}
    `

    main.innerHTML = html
}