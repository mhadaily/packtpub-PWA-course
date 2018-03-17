// add Promise polyfill to window
if (!window.Promise) {
  window.Promise = Promise;
}

var helpers = (function () {
  // get Query params
  var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  // get Hash
  var getHashByName = function (name) {
    var hash = window.location.hash;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[#&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(hash);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  // Format date
  var formatDate = function (d) {
    var date = new Date(d);
    return (
      date.getUTCFullYear() +
      '/' +
      ('0' + (date.getUTCMonth() + 1)).slice(-2) +
      '/' +
      ('0' + date.getUTCDate()).slice(-2) +
      ' ' +
      ('0' + date.getUTCHours()).slice(-2) +
      ':' +
      ('0' + date.getUTCMinutes()).slice(-2) +
      ':' +
      ('0' + date.getUTCSeconds()).slice(-2)
    );
  };

  // Show snackBarMessage
  var showMessage = function (msg) {
    var notification = document.querySelector('#notification');
    var data = {
      message: msg,
      timeout: 2000,
    };
    notification.MaterialSnackbar.showSnackbar(data);
  };

  var urlBase64ToUint8Array = function (base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return {
    urlBase64ToUint8Array: urlBase64ToUint8Array,
    showMessage: showMessage,
    formatDate: formatDate,
    getParameterByName: getParameterByName,
    getHashByName: getHashByName,
  };
})();
