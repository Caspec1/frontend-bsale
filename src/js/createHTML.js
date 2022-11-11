import { cart, addCart, removeProduct, updateQuantity } from "./cartFunctions.js"
import { getProductsByCategory, printPag, totalPag } from './getData.js'
import { catDiv } from "./const.js"


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
                    const newOptions = options.slice(1)
                            
                    return (
                        `   
                        <tr>
                            <td><img src=${image} alt=${`imagen ${name}`} class="header__cart-image"/></td>
                            <td><p class="header__cart-product">${name}</p></td>
                            <td><p class="header__cart-price">${discount !== '' ? `$${parseInt(newPrice) * parseInt(quantity)}` : `$${parseInt(price) * parseInt(quantity)}`}</p></td>
                            <td>
                                <select id="update-quantity" value=${quantity} data-id=${id}>
                                    <option value=${quantity}>${quantity}</option>
                                    ${newOptions.map(o => `<option value=${o}>${o}</option>`)}
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

    const select = document.querySelectorAll('#update-quantity')
    select.forEach(s => {
        s.addEventListener('change', (e) => {
            const value = e.target.value
            const id = e.target.dataset.id
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

            const options = [...Array(21).keys()]
            const newOptions = options.slice(1)
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
                        <form id="form-quantity" class="form-quantity">
                            <select id="select-quantity" class="select-quantity">
                                ${newOptions.map(o => `<option value=${o}>${o}</option>`)}
                            </select>
                            <button type="submit" class='card__add-cart' data-id=${id} id="button-cart" value=${id} data-price=${price} data-name=${name} data-url=${url_image} data-discount=${discount} data-new=${newPrice}><img class="add-cart" src="https://www.svgrepo.com/show/52866/cart.svg"/></button>
                        </form>
                    </div>
                </div>
            `
            )
            
        }).join('')}
    `
    const error = '<p class="error">No existen resultados</p>'

    if(products.length > 0) {
        main.innerHTML = html

        const form = document.querySelectorAll('#form-quantity')

        form.forEach((form) => {
            form.addEventListener('submit', e => {
                e.preventDefault()
                const value = e.target[0].value
                const product = {
                    id: e.target[1].dataset.id,
                    name: e.target[1].dataset.name,
                    image: e.target[1].dataset.url,
                    price: e.target[1].dataset.price,
                    discount: e.target[1].dataset.discount,
                    newPrice: e.target[1].dataset.new,
                    quantity: value
                }
                addCart(product)
            })
        })
    
        while(pag.firstChild) {
            pag.removeChild(pag.firstChild)
        }
        printPag()
    } else {
        main.innerHTML = error
        while(pag.firstChild) {
            pag.removeChild(pag.firstChild)
        }
        printPag()
    }

    

}

export function createCategory(category) {
    category.map(cat => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.textContent = cat.name
        btn.value = cat.id
        btn.id = 'btn-category'
        btn.classList.add('btn-category')

        catDiv.appendChild(btn)
    })

    const buttons = document.querySelectorAll('#btn-category')

    buttons.forEach(cat => {
        cat.addEventListener('click', async (e) => {
            const products = await getProductsByCategory(e.target.value)

            createMainHTML(products.result)
        })
    })
}