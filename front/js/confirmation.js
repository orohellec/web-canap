const getOrderId = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get('orderId')
}

const orderId = getOrderId()

if (orderId) {
  document.getElementById('orderId').textContent = orderId
  localStorage.clear()
}