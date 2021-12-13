function selectTransmission (transmission) {
  document.getElementById('transmissionIframe').setAttribute('src', '/transmission/' + transmission)
}

document.addEventListener('submit', (e) => {
  const form = e.target
  fetch(form.action, {
    method: form.method,
    body: new FormData(form)
  })

  // Prevent the default form submit
  e.preventDefault()
})