function selectTransmission (transmission) {
  document.getElementById('transmissionIframe').setAttribute('src', '/transmission/' + transmission)
}

function getFormData (form) {
  var elements = form.elements
  var obj = {}
  for (var i = 0; i < elements.length; i++) {
    if (elements.item(i).name !== '') {
      var item = elements.item(i)
      obj[item.name] = item.value
    }
  }
  return obj
}

document.addEventListener('submit', (e) => {
  const form = e.target
  const data = getFormData(form)
  $.ajax({
    url: form.action,
    type: 'GET',
    data: data
  }).then(function (response) {
    if (response === 'success') {
      alert(response)
      form.reset()
    } else {
      alert(response)
    }
  })
  e.preventDefault()
})
