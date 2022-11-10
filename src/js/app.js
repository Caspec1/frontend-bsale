let cart = JSON.parse(localStorage.getItem('cart')) ?? []
const pag = document.querySelector('#pag')

const itemsPag = 20
let totalPag
let iterator
let actualPag = 1

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

async function sort() {
    const aside = document.querySelector('.aside')
    const products = await getProducts()

    const sort = products.sort((a,b) => {
        if(a.name < b.name) {
            return -1
        } else if(a.name > b.name) {
            return 1
        } else {
            return 0
        }
    })

    aside.classList.remove('toggle')
    setTimeout(() => {
        createMainHTML(sort)
    }, 500);
}

function createCartHTML() {
    const cartModal = document.querySelector('.header__cart-modal')

    if(cartModal.classList.contains('header__cart-open')) {
        const html = `
        <table class="table">
            <thead class="table__head">
                <tr>
                    <th class="table__head-title">Imagen</th>
                    <th class="table__head-title">Nombre</th>
                    <th class="table__head-title">Precio</th>
                    <th class="table__head-title">Cantidad</th>
                    <th class="table__head-title">Eliminar</th>
                </tr>
            <thead>
            <tbody class="table__body">
                ${cart.map(prod => {

                    const {id, name, image, price, discount, quantity, newPrice} = prod

                    const options = [...Array(20).keys()]
                            
                    return (
                        `   
                        <tr>
                            <td><img src=${image} alt=${`imagen ${name}`} class="header__cart-image"/></td>
                            <td><p class="header__cart-product">${name}</p></td>
                            <td><p class="header__cart-price">${discount !== '' ? `$${parseInt(newPrice) * parseInt(quantity)}` : `$${parseInt(price) * parseInt(quantity)}`}</p></td>
                            <td>
                                <select onchange="updateQuantity(value, ${id})">
                                    ${options.map(o => `<option value=${o}>${o}</option>`)}
                                </select>
                            </td>
                            <td><button type="button" value=${id} onclick="removeProduct(value)" class="header__cart-remove">X</button></td>
                        </tr>
                        `
                    )
                }).join('')}
            </tbody>
        </table>

        <p class="header__cart-pay">Total a pagar: $${cart.reduce((total, prod) => total + (parseInt(prod.discount !== '' ? prod.newPrice : prod.price) * parseInt(prod.quantity)), 0)}</p>
    `
    cartModal.innerHTML = html
    }
}

function toggleCart() {
    const cartModal = document.querySelector('.header__cart-modal')
    cartModal.classList.toggle('header__cart-open')
    cartModal.classList.toggle('header__cart-hide')
    cartModal.classList.toggle('header__cart-toggle')

    createCartHTML()
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
        newPrice,
        quantity: "1"
    }
    verification(product)

}

function verification(prod) {
    const p = prod
    const {id} = prod
    if(cart.length === 0) {
        cart = [...cart, prod]
    } else {
        if(cart.some(prod => prod.id === id)) {
            cart = cart
        } else {
            cart = [...cart, p]
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    createCartHTML()

}

function updateQuantity(q, id) {
    const newQuantity = cart.map(prod => {
        if(prod.id === id.toString()) {
            prod.quantity = q
        }
        return prod
    })
    cart = newQuantity
    localStorage.setItem('cart', JSON.stringify(cart))
    createCartHTML()
}

function removeProduct(value) {
    const removeProduct = cart.filter(prod => prod.id !== value)

    cart = removeProduct

    localStorage.setItem('cart', JSON.stringify(cart))

    createCartHTML()
}

form.addEventListener('submit', async function(e) {
    e.preventDefault()

    const select = parseInt(document.querySelector('#select-form').value)
    const text = document.querySelector('#text').value
    
    const data = {category: select, search: text}

    const url = 'http://localhost:3000/api/products/all'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const result = await response.json();
    totalPag = calculatePag(result.length)

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

    while(pag.firstChild) {
        pag.removeChild(pag.firstChild)
    }
    if(totalPag > 2) {
        printPag()
    }

}
function calculatePag(total) {
    return parseInt(Math.ceil(total / itemsPag))
}
function *createPag(total) {
    for(let i = 1; i <= total; i++) {
        yield i
    }
}
function printPag() {
    iterator = createPag(totalPag)

    while(true) {
        const {value, done} = iterator.next()
        if (done) return

        const btn = document.createElement('a')
        btn.href = '#'
        btn.dataset.pag = value
        btn.textContent = value
        btn.classList.add('button-pag')

        btn.onclick = async () => {
            actualPag = value

            const products = await getProducts()
            createMainHTML(products)
        }

        pag.appendChild(btn)
    }

}
async function getCategory() {
    const url = 'http://localhost:3000/api/category'
    const res = await fetch(url)
    products = await res.json()
    return products
}

async function getProducts() {
    const url = `http://localhost:3000/api/products/${actualPag}/${itemsPag}`
    const res = await fetch(url)
    const result = await res.json()
    totalPag = calculatePag(result.totalData)
    return result.result
}