import { createCartHTML } from './createHTML.js'

export let cart = JSON.parse(localStorage.getItem('cart')) ?? []


export const addCart = (prod) => {
    verification(prod)
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

export function updateQuantity(q, id) {
    const newQuantity = cart.map(prod => {
        if(prod.id === id.toString()) {
            prod.quantity = q
        }
        return prod
    })
    cart = newQuantity
    localStorage.setItem('cart', JSON.stringify(cart))

    createCartHTML(q)
}

export function removeProduct(value) {
    const removeProduct = cart.filter(prod => prod.id !== value)

    cart = removeProduct

    localStorage.setItem('cart', JSON.stringify(cart))

    createCartHTML()
}