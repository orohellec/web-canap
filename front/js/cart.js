class Cart {
  constructor() {
    this.products = JSON.parse(localStorage.getItem('products'))
    this.html = {
      cartItemsSection: document.getElementById('cart__items'),
      cartItemTemplate: document.getElementById('cart__item-template'),
      totalQuantitySpan: document.getElementById('totalQuantity'),
      totalPriceSpan: document.getElementById('totalPrice'),
    }
  }

  initialize() {
    const products = this.products
    if (products) {
      this.displayPriceQuantity(products)
      this.displayProducts(products)
    }
  }

  displayPriceQuantity(products) {
    const totalQuantitySpan = this.html.totalQuantitySpan
    const totalPriceSpan = this.html.totalPriceSpan

    const totalQuantity = products.reduce((accumulator, product) => {
      return accumulator + product.quantity
    }, 0)

    totalQuantitySpan.textContent = totalQuantity

    const totalPrice = products.reduce((accumulator, product) => {
      return accumulator + (product.price * product.quantity)
    }, 0)

    totalPriceSpan.textContent = totalPrice
  }

  displayProducts(products) {
    products.forEach(product => {
      const cartTemplateClone = this.html.cartItemTemplate.content.cloneNode(true)
      const cartItem = cartTemplateClone.querySelector('.cart__item')
      const cartImage = cartTemplateClone.getElementById('cart__item-image')
      const cartDescription = cartTemplateClone.querySelector('.cart__item__content__description')
      const cartQuantity = cartTemplateClone.querySelector('.itemQuantity')
      const cartDeletion = cartTemplateClone.querySelector('.cart__item__content__settings__delete')

      cartItem.setAttribute('data-id', product._id)
      cartItem.setAttribute('data-color', product.chosenColor)

      cartImage.src = product.imageUrl
      cartDescription.firstElementChild.textContent = product.name
      cartDescription.children[1].textContent = product.chosenColor
      cartDescription.children[2].textContent = product.quantity * product.price
      cartQuantity.value = product.quantity

      cartQuantity.addEventListener(
        'change',
        event => {
          this.#onQuantityChange(
            products, product, {
            cartQuantity: cartQuantity,
            cartItem: cartItem,
            cartDescription: cartDescription
          })
        }
      )

      cartDeletion.addEventListener('click', event => {
        this.#onDeleteItem(products, cartItem)
      })

      this.html.cartItemsSection.append(cartTemplateClone);
    })
  }

  #onQuantityChange(products, product, cartElements) {
    console.log('yessss')
    const { cartQuantity, cartItem, cartDescription } = cartElements
    const newQuantity = parseInt(cartQuantity.value)
    const productIndex = products.findIndex(product => {
      return (
        product._id === cartItem.getAttribute('data-id') &&
        product.chosenColor === cartItem.getAttribute('data-color')
      )
    })

    cartDescription.children[2].textContent = newQuantity * product.price

    products[productIndex].quantity = newQuantity
    localStorage.setItem('products', JSON.stringify(products))
    this.displayPriceQuantity(products)
  }

  #onDeleteItem(products, cartItem) {
    const productIndex = products.findIndex(product => {
      return (
        product._id === cartItem.getAttribute('data-id') &&
        product.chosenColor === cartItem.getAttribute('data-color')
      )
    })

    products.splice(productIndex, 1)
    localStorage.setItem('products', JSON.stringify(products))
    cartItem.remove()
  }
}

const cart = new Cart()
cart.initialize()