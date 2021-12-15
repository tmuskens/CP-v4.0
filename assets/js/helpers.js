function getFormData (form) {
  var elements = form.elements
  var obj = {}
  for (var i = 0; i < elements.length; i++) {
    if (elements.item(i).name !== '') {
      var item = elements.item(i)
      obj[item.name] = item.value
    }
  }
  return obj
}
