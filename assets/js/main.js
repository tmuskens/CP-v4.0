function selectTransmission (transmission) {
  $('.transmission-btn').each(function () {
    if (this.value !== transmission) $(this).removeClass('active')
    else $(this).addClass('active')
  })
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

$('.to-btn').click(function () {
  const to = document.getElementsByName('to')[0]
  $(to).val(this.innerHTML)
})

$('.from-btn').click(function () {
  const from = document.getElementsByName('from')[0]
  $(from).val(this.innerHTML)
})

document.addEventListener('submit', (e) => {
  const form = e.target
  console.log(form.action)
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
