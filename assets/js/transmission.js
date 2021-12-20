function printPrevious () {
  const iframe = document.getElementById('prev-return').contentWindow
  iframe.focus()
  iframe.print()
}

$('#print-previous').click(function () {
  printPrevious()
})

$('.to-btn').click(function () {
  const to = document.getElementsByName('to')[0]
  $(to).val(this.innerHTML)
})

$('.from-btn').click(function () {
  const from = document.getElementsByName('from')[0]
  $(from).val(this.innerHTML)
})


$('.change-setting').click(function () {
  const name = this.innerHTML
  const setting = this.name
  const placeholder = $(this).parent().next().html()
  $('#modal-title').html('Update ' + name)
  $('#modal-input').attr('placeholder', placeholder)
  $('#modal-input').attr('name', setting)
  $('#modal-input').val('')
  $('#modal-form').modal('show')
})

function settingsFormSubmit (form) {
  if (form.checkValidity()) {
    const data = getFormData(form)
    $.ajax({
      url: form.action,
      type: 'GET',
      data: data
    }).then(function (response) {
      if (response === 'success') {
        for (const key in data) {
          const elements = document.getElementsByClassName(key + '-text')
          for (const element of elements) {
            $(element).html(data[key])
          }
        }
        $('#modal-form').modal('hide')
      } else {
        alert(response)
      }
    })
  }
}

function transmissionFormSubmit (form) {
  const data = getFormData(form)
  delete data.print
  $.ajax({
    url: form.action,
    type: 'GET',
    data: data
  }).then(function (response) {
    if (response.message === 'success') {
      const print = $('#print-check-box').is(':checked')
      document.getElementById('prev-return').setAttribute('src', '/log/' + response.id + '?print=' + print)
      form.reset()
      parent.showToasts()
    } else {
      alert(response)
    }
  })
}

document.addEventListener('submit', (e) => {
  const form = e.target
  if (form.name === 'transmission') transmissionFormSubmit(form)
  if (form.name === 'settings') settingsFormSubmit(form)
  e.preventDefault()
})