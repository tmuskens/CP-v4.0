function populateLogTable (log) {
  $('#log-body').empty()
  for (const transmission of log) {
    $('#log-body').append('<tr id="' + transmission.id + `" class="log-row">
      <td>` + addLeadingZero(transmission.dtg) + `</td>
      <td>` + transmission.net + `</td>
      <td>` + transmission.sender + `</td>
      <td>` + transmission.reciever + `</td>
      <td>` + transmission.transmission_type + `</td>
    </tr>`)
  }
  $('#log-body').children().eq(0).click()
}

function setIframe (id) {
  document.getElementById('displayIframe').setAttribute('src', '/log/' + id)
  document.getElementById('displayIframe').setAttribute('name', id)
}

function hideEditModal () {
  $('#edit-modal').modal('hide')
}

function setToast (message) {
  $('.toast-body').html(message)
}

$(document).on('click', '.log-row', function () {
  $('.log-row').removeClass('bg-primary selected')
  $(this).addClass('bg-primary selected')
  const id = this.id
  setIframe(id)
})

document.addEventListener('reset', (e) => {
  const form = e.target
  $.ajax({
    url: form.action,
    type: 'GET',
    data: { reset: true }
  }).then(function (response) {
    populateLogTable(response)
  })
})

document.addEventListener('submit', (e) => {
  const form = e.target
  const data = getFormData(form)
  $.ajax({
    url: form.action,
    type: 'GET',
    data: data
  }).then(function (response) {
    populateLogTable(response)
  })
  e.preventDefault()
})

$('#print').click(function () {
  const iframe = document.getElementById('displayIframe').contentWindow
  iframe.focus()
  iframe.print()
})

$('#delete').click(function () {
  const id = $('#displayIframe').attr('name')
  if (id !== undefined) {
    $.ajax({
      url: '/log/delete/' + id,
      type: 'GET',
    }).then(function (response) {
      if (response === 'success') {
        $('#' + id).remove()
        $('#log-body').children().first().click()
        setToast('Transmission Deleted')
        showToasts()
      }
    })
  }
})

$('#edit').click(function () {
  const id = $('#displayIframe').attr('name')
  if (id !== undefined) {
    $('#edit-iframe').attr('src', '/edit/' + id)
    $('#edit-modal').modal('show')
  }
})

$('#save-return').click(function () {
  const iframe = $('#edit-iframe').get(0)
  iframe.contentWindow.submitForm()
})
