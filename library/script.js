$(document).ready(function() {

  var apiRoot = 'https://demo-app-library.herokuapp.com/library/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var libsContainer = $('[data-books-container]');
  
  var availableBooks = {};
 // var availableReaders = {};

  // init
    getAllBooks();
 //   getAllReaders();

  function createBookElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-title-id', data.titleId);
    element.find('[data-author-name-section] [data-author-name-paragraph]').text(data.author);
    element.find('[data-author-name-section] [data-author-name-input]').val(data.author);

    element.find('[data-book-title-section] [data-book-title-paragraph]').text(data.title);
    element.find('[data-book-title-section] [data-book-title-input]').val(data.title);

    element.find('[data-book-release-section] [data-book-release-paragraph]').text(data.releaseDate);
    element.find('[data-book-release-section] [data-book-release-input]').val(data.releaseDate);

    return element;
  }

  
  function prepareBookItemSelectOptions(availableChoices) {
    return availableChoices.map(function(choice) {
      return $('<option>')
                .addClass('crud-select__option')
                .val(choice.booksId)
                .text(choice.bookStatus || 'Unknown name');
    });
  }

  // function prepareUsersSelectOptions(availableUsers) {
  //   return availableUsers.map(function(choice) {
  //     return $('<option>')
  //               .addClass('crud-select__option')
  //               .val(choice.readerId)
  //               .text(choice.surname || 'Unknown name');
  //   });
  // }

   function getAllBooks() {
    var requestUrl = apiRoot + 'getBooks';

    $.ajax({
      url: requestUrl,
      method: 'GET',
      success: handleDatatableRender
    });
  }

//   function getAllReaders() {
//     var requestUrl = apiRoot + 'getUsers';

//     $.ajax({
//       url: requestUrl,
//       method: 'GET',
//       success: function(users) {
//        users.forEach(user => {
//         availableReaders[user.readerId] = user; }
//         )
// }

//       });
//   }

  function handleDatatableRender(books) {
    libsContainer.empty();
    books.forEach(book => {
      availableBooks[book.itemList.bookId] = book;
    });

    books.forEach(function(books) {
      var $datatableRowEl = createBookElement(books);
      var $availableBooksOptionElements = prepareBookItemSelectOptions(books.itemList);

      $datatableRowEl.find('[data-book-name-select]')
        .append($availableBooksOptionElements);

      $datatableRowEl
        .appendTo(libsContainer);
    });
  }
   
  function handleBookDeleteRequest() {
    var parentEl = $(this).parent().parent().parent();
    var titleId = parentEl.attr('data-title-id');
    var requestUrl = apiRoot + 'deleteBook';

    $.ajax({
      url: requestUrl + '?' + $.param({
        titleId: titleId
      }),
      method: 'DELETE',
      success: function() {
        parentEl.slideUp(400, function() { parentEl.remove(); });
      }
    })
  }

  function handleBookSubmitRequest(event) {
    event.preventDefault();

    var bookAuthor = $(this).find('[name="author"]').val();
    var bookTitle = $(this).find('[name="title"]').val();
    var bookYear = $(this).find('[name="year"]').val();

    var requestUrl = apiRoot + 'addBook';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        author: bookAuthor,
        title: bookTitle,
        releaseDate: bookYear

      }),
      complete: function(data) {
        if(data.status === 200) {
          getAllBooks();
        }
      }
    });
  }



 // function handleBoardNameSelect(event) {
 //    var $changedSelectEl = $(event.target);
 //    var selectedUserId = $changedSelectEl.val();
 //    var $listNameSelectEl = $changedSelectEl.siblings('[data-list-name-select]');
 //    var preparedListOptions = prepareUsersSelectOptions(availableReaders);

 //    $listNameSelectEl.empty().append(preparedListOptions);
 //  }

function handleBookRentRequest(event) {
    // nothing yet
  }

  $('[data-book-add-form]').on('submit', handleBookSubmitRequest);

  libsContainer.on('click','[data-book-rent-request-trigger]', handleBookRentRequest);
//  libsContainer.on('change','[data-book-name-select]', handleBoardNameSelect);
  libsContainer.on('click','[data-task-delete-button]', handleBookDeleteRequest);
});
