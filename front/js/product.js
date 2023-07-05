class Product {
  constructor() {
    this.id = this.getIdProduct();
    this.htmlElements = {
      imgWrapper: document.getElementById('item__img'),
      title: document.getElementById('item__title'),
      price: document.getElementById('item__price'),
      description: document.getElementById('item__description'),
      colorsDropdown: document.getElementById('item__colors')
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
      console.log('you need to fetch data with getProductData before to use this method')
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
}

(async () => {
  const product = new Product()
  await product.getProductData()
  await product.insertProductInHtml()
})()
