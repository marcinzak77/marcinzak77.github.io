$(document).ready(function() {

  var apiRoot = 'http://localhost:8080/v1/task/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var bookContainer = $('[data-tasks-container]');

  // init
  getAllTasks();

  function createElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-task-id', data.id);
    element.find('[data-book-author-section] [data-book-author-paragraph]').text(data.title);
    element.find('[data-book-author-section] [data-book-author-input]').val(data.title);
    element.find('[data-book-title-section] [data-book-title-paragraph]').text(data.content);
    element.find('[data-book-title-section] [data-book-title-input]').val(data.content);
    element.find('[data-task-id-section] [data-task-id-paragraph]').text(data.id);
    element.find('[data-task-id-section] [data-task-id-input]').val(data.id);


    return element;
  }

  function handleDatatableRender(data) {
    bookContainer.empty();
    data.forEach(function(task) {
      createElement(task).appendTo(bookContainer);
    });
  }

  function getAllTasks() {
    var requestUrl = apiRoot + 'getTasks';

    $.ajax({
      url: requestUrl,
      method: 'GET',
      success: handleDatatableRender
    });
  }

  function handleTaskUpdateRequest() {
    var parentEl = $(this).parent().parent();
    var taskId = parentEl.attr('data-task-id');
    var taskTitle = parentEl.find('[data-book-author-input]').val();
    var taskContent = parentEl.find('[data-book-title-input]').val();
    var requestUrl = apiRoot + 'updateTask';

    $.ajax({
      url: requestUrl,
      method: "PUT",
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        id: taskId,
        title: taskTitle,
        content: taskContent
      }),
      success: function(data) {
        parentEl.attr('data-task-id', data.id).toggleClass('datatable__row--editing');
        parentEl.find('[data-book-author-paragraph]').text(taskTitle);
        parentEl.find('[data-book-title-paragraph]').text(taskContent);
      }
    });
  }

  function handleTaskDeleteRequest() {
    var parentEl = $(this).parent().parent();
    var taskId = parentEl.attr('data-task-id');
    var requestUrl = apiRoot + 'deleteTask';

    $.ajax({
      url: requestUrl + '/?' + $.param({
        taskId: taskId
      }),
      method: 'DELETE',
      success: function() {
        parentEl.slideUp(400, function() { parentEl.remove(); });
      }
    })
  }

  function handleTaskSubmitRequest(event) {
    event.preventDefault();

    var taskTitle = $(this).find('[name="title"]').val();
    var taskContent = $(this).find('[name="content"]').val();

    var requestUrl = apiRoot + 'createTask';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        title: taskTitle,
        content: taskContent
      }),
      complete: function(data) {
        if(data.status === 200) {
          getAllTasks();
        }
      }
    });
  }

  function toggleEditingState() {
    var parentEl = $(this).parent().parent();
    parentEl.toggleClass('datatable__row--editing');

    var taskTitle = parentEl.find('[data-book-author-paragraph]').text();
    var taskContent = parentEl.find('[data-book-title-paragraph]').text();

    parentEl.find('[data-book-author-input]').val(taskTitle);
    parentEl.find('[data-book-title-input]').val(taskContent);
  }

  $('[data-task-add-form]').on('submit', handleTaskSubmitRequest);

  bookContainer.on('click','[data-task-edit-button]', toggleEditingState);
  bookContainer.on('click','[data-task-edit-abort-button]', toggleEditingState);
  bookContainer.on('click','[data-task-submit-update-button]', handleTaskUpdateRequest);
  bookContainer.on('click','[data-task-delete-button]', handleTaskDeleteRequest);
});