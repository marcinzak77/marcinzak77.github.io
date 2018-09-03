$(document).ready(function() {

  var apiRoot = 'https://demo-app-library.herokuapp.com/library/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var userContainer = $('[data-user-container]');

  // init
  getAllUsers();

    function createUserElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-user-id', data.titleId);
    element.find('[data-user-name-section] [data-user-name-paragraph]').text(data.name);
    element.find('[data-user-name-section] [data-user-name-input]').val(data.name);

    element.find('[data-user-surname-section] [data-user-surname-paragraph]').text(data.surname);
    element.find('[data-user-surname-section] [data-user-surname-input]').val(data.surname);

    element.find('[data-user-account-section] [data-user-account-paragraph]').text(data.accountCreationDate);
    element.find('[data-user-account-section] [data-user-account-input]').val(data.accountCreationDate);

    return element;
  }

  function handleDatatableUserRender(data) {
    userContainer.empty();
    data.forEach(function(user) {
      createUserElement(user).appendTo(userContainer);
    });
  }

    function getAllUsers() {
    var requestUrl = apiRoot + 'getUsers';

    $.ajax({
      url: requestUrl,
      method: 'GET',
      success: handleDatatableUserRender
    });
  }

  
function handleUserSubmitRequest(event) {
    event.preventDefault();

    var name = $(this).find('[name="name"]').val();
    var surname = $(this).find('[name="surname"]').val();
    
    var requestUrl = apiRoot + 'createUser';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        name: name,
        surname: surname
      }),

      complete: function(data) {
        if(data.status === 200) {
          getAllUsers();
        }
      }
    });
  }


  $('[data-user-add-form]').on('submit', handleUserSubmitRequest);
 
});