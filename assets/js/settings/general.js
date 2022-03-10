function settingsFormSubmit (e) {
  const form = e.target
  console.log('submitting')
  if (form.checkValidity()) {
    const data = getFormData(form)
    $.ajax({
      url: form.action,
      type: 'GET',
      data: data
    }).then(function (response) {
      if (response === 'success') {
        parent.setToastText('Settings updated')
        parent.showToasts()
      } else {
        alert(response)
      }
    })
  }
  e.preventDefault()
}

$('#confirm-reset').click(function () {
  $.ajax({
    url: '/reset_log',
    type: 'GET'
  }).then(function (response) {
    if (response === 'success') {
      parent.setToastText('Log reset')
      parent.showToasts()
      $('#confirmation-modal').modal('hide')
    } else {
      alert(response)
    }
  })
})

document.addEventListener('submit', (e) => {
  console.log('form submit')
  const form = e.target
  if (form.name === 'settings') settingsFormSubmit(e)
})

$('#stop-server').click(function () {
  $.ajax({
    url: '/stop_server',
    type: 'GET'
  })
})
