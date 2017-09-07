var cookieTool = {
  // Sets a cookie
  // Accepts a callback function
  setCookie: function(cName, cValue, exDays, path, onCookieSet) {
    exDays = typeof exDays !== 'undefined' ? exDays : 365;
    path = typeof path !== 'undefined' ? ";path=" + path : path = '';
    var d = new Date();
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + path;
    if (onCookieSet) {
      onCookieSet(cName, cValue, d, path);
    }
  },
  getCookie: function(cName) {
    var name = cName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  // Checks for a cookie by name
  // Accepts a callback function for if cookie exists
  // Accepts a second callback function for if cookie does not exist
  checkCookie: function(cName, cExists, cDoesntExist) {
    var c = cookieTool.getCookie(cName);
    if (c !== "") {
      if(cExists !== undefined) {
        cExists(cName, c);
      } else {
        console.log(c);
      }
    } else {
      if(cDoesntExist !== undefined) {
        cDoesntExist(cName);
      } else {
        console.log(cName + " does not exist");
      }
    }
  }
};