function complete (id) {
  parent.setIframe(id)
  parent.hideEditModal()
  parent.setToast('Transmission Updated')
  parent.showToasts()
}

function transmissionFormUpdate (form) {
  const id = form.name
  const data = getFormData(form)
  $.ajax({
    url: form.action,
    type: 'GET',
    data: data
  }).then(function (response) {
    if (response.message === 'success') {
      complete(id)
    } else {
      alert(response.message)
    }
  })
}

function submitForm () {
  const form = $('#edit-form').get(0)
  transmissionFormUpdate(form)
}
