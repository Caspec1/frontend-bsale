import { cart, addCart, updateQuantity, removeProduct } from "./cartFunctions.js"
import { printPag } from './getData.js'
import { totalPag } from './getData.js'

export function createCartHTML(value = 1) {
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

                    const options = [...Array(21).keys()]
                            
                    return (
                        `   
                        <tr>
                            <td><img src=${image} alt=${`imagen ${name}`} class="header__cart-image"/></td>
                            <td><p class="header__cart-product">${name}</p></td>
                            <td><p class="header__cart-price">${discount !== '' ? `$${parseInt(newPrice) * parseInt(quantity)}` : `$${parseInt(price) * parseInt(quantity)}`}</p></td>
                            <td>
                                <select id="select-quantity">
                                    ${options.map(option => `<option data-id=${id} value=${option}>${option}</option>`).join('')}
                                </select>
                            </td>
                            <td><button id="btn-delete" type="button" value=${id} class="header__cart-remove">X</button></td>
                        </tr>
                        `
                    )
                }).join('')}
            </tbody>
        </table>

        <p class="header__cart-pay">Total a pagar: $${cart.reduce((total, prod) => total + (parseInt(prod.discount !== '' ? prod.newPrice : prod.price) * parseInt(prod.quantity)), 0)}</p>
    `

    cartModal.innerHTML = html

    const newQuantity = document.querySelectorAll('#select-quantity')

    newQuantity.forEach(prod => {

        prod.addEventListener('change', (e) => {
            const id = e.target[0].dataset.id
            const value = e.target.value

            updateQuantity(value, id)
        })
    })

    const btnDelete = document.querySelectorAll('#btn-delete')

    btnDelete.forEach(prod => {
        prod.addEventListener('click', (e) => {
            removeProduct(e.target.value)
        })
    })

    }
}

export function createMainHTML(products) {

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
                        <button type="button" class='card__add-cart' data-id=${id} id="button-cart" value=${id} data-price=${price} data-name=${name} data-url=${url_image} data-discount=${discount} data-new=${newPrice}>Agregar al carrito</button>
                    </div>
                </div>
            `
            )
            
        }).join('')}
    `
    const error = '<p class="error">No existen resultados</p>'

    if(products.length > 0) {
        main.innerHTML = html

        const add = document.querySelectorAll(`[data-id]`)
    
        add.forEach(prod => {
    
            prod.addEventListener('click', (e) => {
        
                const product = {
                    id: e.target.dataset.id,
                    name: e.target.dataset.name,
                    image: e.target.dataset.url,
                    price: e.target.dataset.price,
                    discount: e.target.dataset.discount,
                    newPrice: e.target.dataset.new,
                    quantity: "1"
            }
                addCart(product)
            })
        })
    
        while(pag.firstChild) {
            pag.removeChild(pag.firstChild)
        }
        if(totalPag > 2) {
            printPag()
        }
    } else {
        main.innerHTML = error
        while(pag.firstChild) {
            pag.removeChild(pag.firstChild)
        }
        if(totalPag > 2) {
            printPag()
        }
    }

    

}

export function createAsideHTML(category) {

    const aside = document.querySelector('#select-form')

    const html = `
        <option value="0">Todas</option>
        ${category.map(cat => `<option value=${cat.id} name="category">${cat.name}</option>`)}
    `

    aside.innerHTML = html
}