import { createCartHTML, createCategory } from './createHTML.js'
import { getCategory, getProducts } from './getData.js'
import { createMainHTML } from './createHTML.js'
import { menu, shopping } from './const.js'
import { cart, createCartSize } from './cartFunctions.js'


window.onload = async () => {
    const [category, products] = await Promise.all([
        getCategory(),
        getProducts()
    ])

    createCategory(category)
    createMainHTML(products.result)
    createCartSize(cart)
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