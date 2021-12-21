document.addEventListener('submit', (e) => {
  e.preventDefault()
})

function setShowToast (text) {
  parent.setToastText(text)
  parent.showToasts()
}

function editTransmissionName () {
  $('#transmission-name').attr('contenteditable', 'true')
  $('#transmission-name').focus()
  $('#transmission-name').select()
}

function createInputRow (serial, desc, type, options, rowType) {
  const types = ['short', 'long', 'location', 'option']
  const selected = types.map(t => (t === type) ? 'selected' : '')
  const disReq = (type !== 'option') ? 'disabled' : 'required'
  const row = `<tr class="edit-mode" data-type="${rowType}">
    <td><input name="serial" class="form-control form-control-sm" value="${serial}" required/></td>
    <td><input name="desc" class="form-control form-control-sm" value="${desc}" required/> </td>
    <td>
      <select name="type" class="form-select form-select-sm">
        <option value="short" ${selected[0]}>short</option>
        <option value="long" ${selected[1]}>long</option>
        <option value="location" ${selected[2]}>location</option>
        <option value="option" ${selected[3]}>option</option>
      </select>
    </td>
    <td><input name="options" class="form-control form-control-sm" value="${options}" ${disReq}/></td>
    <td>
      <button type="submit" class="btn btn-sm btn-outline-secondary done-btn">Done</button>
      <button type="button" class="btn btn-sm btn-outline-secondary cancel-btn">Cancel</button>
    </td>  
  </tr>`
  return row
}

function createRow (serial, desc, type, options) {
  const row = `<tr class="serial-row">
    <td class="px-3">${serial}</td>
    <td class="px-3">${desc}</td>
    <td>${type}</td>
    <td>${options}</td>
    <td><button class="btn btn-sm btn-outline-secondary edit-btn">Edit</button></td>
  </tr>`
  return row
}

function createTransmissionRow (name) {
  const row = `<tr class="transmission-row">
      <td>${name}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary edit-return">Edit</button>
        <button class="btn btn-sm btn-outline-secondary delete-return">Delete</button>
      </td>
    </tr>`
  return row
}

function loadSerialsModal (transmission) {
  $('#serials-tbody').html('')
  $('#transmission-name').html(transmission.transmission)
  const serials = transmission.serials
  for (const serial of serials) {
    var options = ''
    if (serial.type === 'option') {
      options = serial.options.join(', ')
    }
    const row = createRow(serial.serial, serial.description, serial.type, options)
    $('#serials-tbody').append(row)
  }
  $('#serials-modal').modal('show')
}

/* --- MODAL BUTTONS --- */
$('#transmission-name').click(function () {
  editTransmissionName()
})

$('#edit-name').click(function () {
  editTransmissionName()
})

$('#transmission-name').focusout(function () {
  $('#transmission-name').attr('contenteditable', 'false')
})

$('#delete-serial').click(function () {
  $('#serials-tbody').find('.selected').remove()
})

$(document).on('click', '.done-btn', function () {
  const row = $(this).parent().parent()
  if ($('#validity-form').get(0).checkValidity()) {
    row.removeClass('edit-mode')
    const serial = row.find('input[name="serial"]').val()
    const description = row.find('input[name="desc"]').val()
    const type = row.find('select[name="type"]').val()
    const options = row.find('input[name="options"]').val()
    const newRow = createRow(serial, description, type, options)
    if (row.attr('data-type') === 'edit') row.prev().remove()
    row.replaceWith(newRow)
  }
})

$(document).on('click', '.cancel-btn', function () {
  const row = $(this).parent().parent()
  if (row.attr('data-type') === 'edit') row.prev().show()
  row.remove()
})

$(document).on('click', '.edit-btn', function () {
  const row = $(this).parent().parent()
  row.removeClass('bg-primary text-light')
  const serial = row.children().eq(0).html()
  const description = row.children().eq(1).html()
  const type = row.children().eq(2).html()
  const options = row.children().eq(3).html()
  const inputRow = createInputRow(serial, description, type, options, 'edit')
  row.hide()
  row.after(inputRow)
})

$(document).on('click', '.serial-row', function () {
  const set = ($(this).hasClass('selected'))
  const editMode = ($('.edit-mode').length > 0)
  $('.serial-row').removeClass('bg-primary text-light selected')
  $('.serial-row').find('.edit-btn').removeClass('btn-outline-light').addClass('btn-outline-secondary')
  if (!set && !editMode) {
    $(this).addClass('bg-primary text-light selected')
    $(this).find('.edit-btn').removeClass('btn-outline-secondary').addClass('btn-outline-light')
    $('#row-buttons').show()
  } else $('#row-buttons').hide()
})

$(document).on('change', 'select', function () {
  const options = $(this).parent().parent().find('input[name="options"]')
  if ($(this).val() === 'option') {
    options.prop('disabled', false)
    options.prop('required', true)
  }
  else {
    options.val('')
    options.prop('required', false)
    options.prop('disabled', true)
  }
})

$('#add-serial').click(function () {
  $('#serials-tbody').find('.done-btn').click()
  if ($('#validity-form').get(0).checkValidity()) {
    const inputRow = createInputRow('', '', '', '', 'new')
    $('.serial-row').removeClass('bg-primary text-light selected')
    $('#serials-tbody').append(inputRow)
  }
})

$('#serial-up').click(function () {
  const selected = $('#serials-tbody').find('.selected')
  selected.prev().before(selected)
})

$('#serial-down').click(function () {
  const selected = $('#serials-tbody').find('.selected')
  selected.next().after(selected)
})

$('#save-return').click(function () {
  if ($('#validity-form').get(0).checkValidity()) {
    $('.done-btn').click()
    const name = $('#transmission-name').html()
    const serials = []
    $('.serial-row').each(function () {
      const serial = {
        serial: $(this).children().eq(0).html(),
        description: $(this).children().eq(1).html(),
        type: $(this).children().eq(2).html()
      }
      const options = $(this).children().eq(3).html().split(',')
      const trimmed = options.map(option => option.trim())
      if ($(this).children().eq(3).html() !== '') serial.options = trimmed
      serials.push(serial)
    })
    const serialsType = $('#serials-tbody').attr('data-type')
    const oldName = $('#serials-tbody').attr('data-old-name')
    $.ajax({
      url: 'update_serials',
      type: 'POST',
      data: {
        type: serialsType,
        data: {
          transmission: name,
          serials: serials
        },
        old: oldName
      }
    }).then(function (response) {
      if (response === 'success') {
        const row = createTransmissionRow(name)
        if (serialsType === 'new') {
          $('#transmissions-table').append(row)
        } else {
          $('.transmission-row').each(function () {
            if ($(this).children().eq(0).html() === oldName) {
              $(this).replaceWith(row)
            }
          })
        }
        $('#serials-modal').modal('hide')
        setShowToast('Serials updated!')
      } else {
        alert(response)
      }
    })
  }
})

/* --- MAIN PAGE BUTTONS --- */
$('#new-return').click(function () {
  $('#serials-tbody').attr('data-type', 'new')
  const newReturn = {
    transmission: 'New Return',
    serials: []
  }
  loadSerialsModal(newReturn)
})

$('.edit-return').click(function () {
  const name = $(this).parent().parent().children().eq(0).html()
  $.ajax({
    url: 'get_serials',
    type: 'GET',
    data: { name: name }
  }).then(function (response) {
    loadSerialsModal(response)
    $('#serials-tbody').attr('data-type', 'edit')
    $('#serials-tbody').attr('data-old-name', name)
  })
})

$('.delete-return').click(function () {
  const name = $(this).parent().parent().children().eq(0).html()
  $.ajax({
    url: 'delete_return',
    type: 'GET',
    data: { name: name }
  }).then(function (response) {
    if (response === 'success') {
      $('.transmission-row').each(function () {
        if ($(this).children().eq(0).html() === name) {
          $(this).remove()
        }
      })
    } else alert(response)
  })
})
