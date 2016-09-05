/*globals $:false, console:false, io:false*/
var $board = $('#J_Board'),
    $input = $('#J_Input'),
    $submit = $('#J_Send'),
    $exit = $('#J_Exit'),
    socket = io(),
    myName = $('#J_Hidden').val(),
    d, h, m, lastTime,
    i = 0;

function updateScrollbar() {
  $board.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(time){
  if((!lastTime)||(time.diff(lastTime,'minutes')>0)) {
    $('<div class="timestamp">' + time.format('MM-DD HH:mm') + '</div>').appendTo($('.message:last'));
    lastTime = time;
  }
}

function insertMessage() {
  var msg = $input.val(),
      now = Date.now();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal" data-id="' + now + '">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new unconfirmed');
  setDate(moment());
  $input.val(null);
  updateScrollbar();
  socket.emit('message', {name:myName, text:msg, timeDesc:now.toString()});
}

function loadMessages() {
  $('<div class="message loading new"><figure class="avatar"><img src="../imgs/others.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();
  $.ajax({
    type: 'GET',
    url: '/messages',
    dataType: 'json',
    success: function (data){
      setTimeout(function() {
        $('.message.loading').remove();
        updateScrollbar();
        _.each(data, function(item) {
          if(item.name !== myName){
            $('<div class="message new"><figure class="avatar"><img src="../imgs/others.jpg" /></figure><p class="username">' + item.name + ': </p>' + item.text + '</div>').appendTo($('.mCSB_container')).addClass('new');
          }else {
            $('<div class="message message-personal">' + item.text + '</div>').appendTo($('.mCSB_container')).addClass('new');
          }
          setDate(moment(item.time));
          updateScrollbar();
        });
      }, 1000 + (Math.random() * 20) * 100);

    }
  });
}

$(window).load(function() {
  $board.mCustomScrollbar();
  setTimeout(function() {
    // fakeMessage();
    loadMessages();
  }, 100);
});

$submit.click(function() {
  insertMessage();
});

$exit.click(function() {
  history.back();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
});

socket.on('newMessage', function(msg){
  if (msg.name === myName) {
    $('.message[data-id="' + msg.timeDesc +'"]').removeClass('unconfirmed')
  }else{
    $('<div class="message new"><figure class="avatar"><img src="../imgs/others.jpg" /></figure><p class="username">' + msg.name + ': </p>' + msg.text + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate(moment(msg.time));
    updateScrollbar();
  }
});