function selectTransmission (transmission) {
  $('.transmission-btn').each(function () {
    if (this.value !== transmission) $(this).removeClass('active')
    else $(this).addClass('active')
  })
  document.getElementById('transmissionIframe').setAttribute('src', '/transmission/' + transmission)
}

