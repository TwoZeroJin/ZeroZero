$(function () {
  function get2digits(num) {
    return ("0" + num).slice(-2);
  }

  function getDate(dateObj) {
    if (dateObj instanceof Date)
      return (
        dateObj.getFullYear() +
        "년 " +
        get2digits(dateObj.getMonth() + 1) +
        "월 " +
        get2digits(dateObj.getDate()) +
        "일"
      );
  }

  function getTime(dateObj) {
    if (dateObj instanceof Date)
      return (
        get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())
      );
  }

  function convertDate() {
    $("[data-date]").each(function (index, element) {
      var dateString = $(element).data("date");
      if (dateString) {
        var date = new Date(dateString);
        $(element).html(getDate(date));
      }
    });
  }

  function convertDateTime() {
    $("[data-date-time]").each(function (index, element) {
      var dateString = $(element).data("date-time");
      if (dateString) {
        var date = new Date(dateString);
        $(element).html(getDate(date) + " " + getTime(date));
      }
    });
  }

  convertDate();
  convertDateTime();
});
