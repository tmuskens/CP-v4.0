function setToastText (text) {
  $('#toast-text').html(text)
}

$('.setting-btn').click(function () {
  const val = this.value
  $('#settings-iframe').attr('src', '/settings/' + val)
  $('.setting-btn').each(function () {
    $(this).removeClass('active')
  })
  $(this).addClass('active')
  const title = this.innerHTML
  $('#banner').html(title)
})
