function selectTransmission (transmission) {
  document.getElementById('transmissionIframe').setAttribute('src', '/transmission?type=' + transmission)
}
