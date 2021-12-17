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

document.addEventListener('submit', (e) => {
  console.log('form submit')
  const form = e.target
  if (form.name === 'settings') settingsFormSubmit(e)
})
