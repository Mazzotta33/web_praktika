$(function () {

  /* Подтверждение перед удалением через data-confirm */
  $(document).on('submit', 'form[data-confirm]', function () {
    return confirm($(this).data('confirm'));
  });

  /* Живой счётчик символов в поле поиска */
  var $nameInput = $('input[name="name"]');
  if ($nameInput.length) {
    $nameInput.on('input', function () {
      var val = $(this).val().trim();
      if (val.length > 0 && val.length < 2) {
        $(this).css('border-color', '#f0a500');
      } else {
        $(this).css('border-color', '');
      }
    });
  }

  /* Предпросмотр загружаемого фото */
  $('input[type="file"][name="photo"]').on('change', function () {
    var file = this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var $preview = $('<img>').attr('src', e.target.result)
        .css({ maxHeight: '100px', marginTop: '8px', borderRadius: '6px', display: 'block' });
      var $existing = $('#photo-preview');
      if ($existing.length) {
        $existing.attr('src', e.target.result);
      } else {
        $('<img id="photo-preview">').attr('src', e.target.result)
          .css({ maxHeight: '100px', marginTop: '8px', borderRadius: '6px', display: 'block' })
          .insertAfter($('input[name="photo"]'));
      }
    };
    reader.readAsDataURL(file);
  });

  /* Автоматически скрыть flash-сообщения через 4 секунды */
  setTimeout(function () {
    $('.flash').fadeOut(500);
  }, 4000);

});
