(async () => {
  const getProducts = async () => {
    return await new Promise((resolve, reject) => {
      fetch('http://localhost:3000/api/products')
        .then(res => resolve(res.json()))
        .catch(err => reject(err))
    })
  }
  const products = await getProducts()
  const productTemplate = document.getElementById('items__products-list')
  const itemsSection = document.getElementById('items')

  products.forEach(product => {
    const productElt = productTemplate.content.cloneNode(true)
    const productLink = productElt.getElementById('items__product-link')
    const productImg = productElt.getElementById('items__product-img')
    const productTitle = productElt.getElementById('items__product-title')
    const productDescription = productElt.getElementById('items__product-description')

    productLink.href = `./product.html?id=${product._id}`
    productImg.src = product.imageUrl
    productImg.alt = product.name
    productTitle.textContent = product.name
    productDescription.textContent = product.description

    itemsSection.append(productElt)
  })
})()
