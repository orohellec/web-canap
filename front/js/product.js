class Product {
  constructor() {
    this.id = this.getIdProduct();
    this.htmlElements = {
      imgWrapper: document.getElementById('item__img'),
      title: document.getElementById('item__title'),
      price: document.getElementById('item__price'),
      description: document.getElementById('item__description'),
      colorsDropdown: document.getElementById('item__colors'),
      quantity: document.getElementById('item__quantity')
    };
  }

  getIdProduct() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('id')
  }

  async getProductData() {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${this.id}`)
      this.data = await res.json()
    } catch (error) {
      console.log(error)
    }
  }

  async insertProductInHtml() {
    if (!this.data) {
      console.log('No Data. You need to fetch data with getProductData before to use this method')
      return
    }
    const html = this.htmlElements
    const product = this.data

    html.imgWrapper.innerHTML = `<img src=${product.imageUrl} alt=${product.name} />`
    html.title.textContent = product.name
    html.price.textContent = product.price
    html.description.textContent = product.description

    const colorsOptions = ["<option value=''>--SVP, choisissez une couleur --</option>"]
    product.colors.forEach(color => {
      colorsOptions.push(`<option value=${color}>${color}</option>`)
    })

    html.colorsDropdown.innerHTML = colorsOptions.join('\n')
  }

  async addToCart() {
    const chosenColor = this.htmlElements.colorsDropdown.value
    if (!chosenColor) {
      alert('Vous devez sélectionner une couleur avant de pouvoir ajouter cet article à votre panier')
      return
    }

    const quantity = parseInt(this.htmlElements.quantity.value)
    if (!quantity) {
      alert('Vous devez au moins ajouter un article à votre panier')
      return
    }

    Object.assign(this.data, { chosenColor: chosenColor, quantity: quantity })
    const getProductsInCart = localStorage.getItem('products')

    if (!getProductsInCart) {
      localStorage.setItem('products', JSON.stringify([this.data]))
    } else {
      const productsInCart = JSON.parse(getProductsInCart)
      const productIndex = productsInCart.findIndex(product => {
        return ((product._id === this.id) && (product.chosenColor === chosenColor))
      })

      if (productIndex !== -1) {
        const product = productsInCart[productIndex]
        product.quantity += quantity
      } else {
        productsInCart.push(this.data)
        // sort product by ids
        productsInCart.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        })
      }
      localStorage.setItem('products', JSON.stringify(productsInCart))
    }

    const loc = location.pathname
    const dir = loc.substring(0, loc.lastIndexOf('/'))

    location.replace(`${dir}/cart.html`)
  }
}

const product = new Product();

// const loc = location.pathname
// const dir = loc.substring(0, loc.lastIndexOf('/')) + '/cart'
// console.log(dir)

product.getProductData()
  .then(() => {
    product.insertProductInHtml()
  })
