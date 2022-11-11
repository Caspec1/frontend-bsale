import { createCartHTML } from './createHTML.js'
import { getCategory, getProducts } from './getData.js'
import { createMainHTML, createAsideHTML } from './createHTML.js'
import { menu, shopping } from './const.js'


window.onload = async () => {
    const [category, products] = await Promise.all([
        getCategory(),
        getProducts()
    ])

    createAsideHTML(category)
    createMainHTML(products.result)
}

menu.addEventListener('click', () => {
    const aside = document.querySelector('.aside')
    aside.classList.toggle('toggle')
})

shopping.addEventListener('click', () => {
    const cartModal = document.querySelector('.header__cart-modal')
    cartModal.classList.toggle('header__cart-open')
    cartModal.classList.toggle('header__cart-hide')
    cartModal.classList.toggle('header__cart-toggle')

    createCartHTML()
})