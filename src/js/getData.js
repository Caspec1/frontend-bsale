import { itemsPag, aside } from './const.js'
import { createMainHTML } from './createHTML.js'

let products = []
let iterator
export let actualPag = 1
export let totalPag

export async function getCategory() {
    const url = 'http://localhost:3000/api/category'
    const res = await fetch(url)
    products = await res.json()
    return products
}

export async function getProducts() {
    const url = `http://localhost:3000/api/products/${actualPag}/${itemsPag}`
    const res = await fetch(url)
    const result = await res.json()
    totalPag = calculatePag(result.totalData)
    return {result: result.result, totalPag}
}


export function calculatePag(total) {
    return parseInt(Math.ceil(total / itemsPag))
}

function *createPag(total) {
    for(let i = 1; i <= total; i++) {
        yield i
    }
}
export function printPag() {
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
            createMainHTML(products.result)
        }

        pag.appendChild(btn)
    }
}
form.addEventListener('submit', async function(e) {
    e.preventDefault()

    const select = parseInt(document.querySelector('#select-form').value)
    const text = document.querySelector('#text').value
    

    try {
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

        aside.classList.remove('toggle')

        createMainHTML(result)
    } catch (error) {
        console.log(error)
    }
})