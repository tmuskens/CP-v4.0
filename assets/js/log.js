function populateLogTable (log) {
  $('#log-body').empty()
  for (const transmission of log) {
    $('#log-body').append('<tr id="' + transmission.id + `">
      <td>` + transmission.dtg + `</td>
      <td>` + transmission.net + `</td>
      <td>` + transmission.sender + `</td>
      <td>` + transmission.reciever + `</td>
      <td>` + transmission.transmission_type + `</td>
    </tr>`)
  }
}

$('.log-row').click(function () {
  $('.log-row').removeClass('bg-primary text-light')
  $(this).addClass('bg-primary text-light')
  const id = this.id
  document.getElementById('displayIframe').setAttribute('src', '/log/' + id)
  document.getElementById('displayIframe').setAttribute('name', id)
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
  $.ajax({
    url: '/log/delete/' + id,
    type: 'GET',
  }).then(function (response) {
    if (response === 'success')
    $('#' + id).remove()
    $('#log-body').children().first().click()
    showToasts()
  })
})