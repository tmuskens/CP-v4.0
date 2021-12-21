function setShowToast (text) {
  parent.setToastText(text)
  parent.showToasts()
}

function textSettingsFormSubmit (form) {
  const data = getFormData(form)
  $.ajax({
    url: form.action,
    type: 'GET',
    data: data
  }).then(function (response) {
    if (response === 'success') {
      setShowToast('List updated')
    }
  })
}

document.addEventListener('submit', (e) => {
  const form = e.target
  textSettingsFormSubmit(form)
  e.preventDefault()
})