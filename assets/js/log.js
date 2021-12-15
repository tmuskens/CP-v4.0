function populateLogTable (log) {
  $('#log-body').empty()
  for (const transmission of log) {
    $('#log-body').append('<tr id="log-' + transmission.id + `">
      <td>` + transmission.dtg + `</td>
      <td>` + transmission.net + `</td>
      <td>` + transmission.sender + `</td>
      <td>` + transmission.reciever + `</td>
      <td>` + transmission.transmission_type + `</td>
    </tr>`)
  }
}


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
