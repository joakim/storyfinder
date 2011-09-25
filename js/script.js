var SF = (function ($, _) { 
  var my = {}, that = this;

  my.originalTopic = null;

  var tpl = {};
  tpl.tweet = _.template('<article><img src="<%= image %>"/><div class="text"><%= text %></div><summary><div class="user"><%= user %></div><div class="date"><%= date %></div></summary></article>');

  my.theme = function(template, variables) {
    return tpl[template](variables);
  };

  my.displayTweets = function($element) {
    $.getJSON('data/' + $element.attr('data:set') + '.json', function(data) {
      output = '';
      _.each(data[0], function(element, index) {
        output += SF.theme('tweet', {
          image: element.profile_image_url,
          text: element.text,
          user: element.from_user,
          date: element.created_at,
        });
      });

      $('.tweets').empty().append(output);

      $('.tweets article').draggable({
        revert: 'invalid'
      });

      if (my.originalTopic !== null) {
        $('header.topic-header h1').text(my.originalTopic + ' › ' + $element.text());
      }
      else {
        $('header.topic-header h1').text($element.text());
      }
    });
  }

  return my; 
}(jQuery, _));

// Called on page load.
$(function() {
  // Open the topmost topic.
  SF.displayTweets($('nav.topics ul a:first'));

  // Open a topic when selected in the sidebar.
  $('.topics ul a').bind('click', function() {
    SF.displayTweets($(this));
    return false;
  });

  if ($('body').is('.view-story')) {
    SF.originalTopic = $('header.topic-header h1').text();
  }

  $('.filters .keywords-element ul').tagit();

  $('.filters .language-element, .filters .gender-element').chosen();

  $('.filters .age-element').slider({
		range: true,
		values: [0, 99],
		min: 0,
		max: 99,
		slide: function(event, ui) {
		  var value;
		  if (ui.values[0] == 0 && ui.values[1] == 99) {
		    value = 'All ages';
		  }
		  else {
		    value = ui.values[0] + ' - ' + ui.values[1];
		  }
			$('.filters .age-value').text(value);
		}
	});

  $('.filters .time-of-day-element').slider({
		range: true,
		values: [0, 24],
		min: 00,
		max: 24,
		slide: function(event, ui) {
		  if (String(ui.values[0]).length == 1) {
		    ui.values[0] = '0' + String(ui.values[0]);
		  }
			$('.filters .time-of-day-value').text(ui.values[0] + ':00 - ' + ui.values[1] + ':00');
		}
	});

  $('.filters .proximity-element').slider({
		range: 'min',
		value: 10000, // Hundreds of meters
		min: 1,
		max: 10000,
		slide: function(event, ui) {
			$('.filters .proximity-value').text((ui.value / 10) + ' km');
		}
	});

  $('.filters .ui-slider, .filters .chzn-results li, .filters .keywords-button').bind('mouseup', function() {
    var that = this;
    $('.tweets').fadeTo(600, 0.3, function() {
      $(this).fadeTo(0, 1).find('article').shuffle().show();

      if ($(that).is('.proximity-element')) {
        var num = 100 - ($(that).slider('value') / 10000) * 100;
        $('.tweets article').slice(0, num).hide();
      }
    });
  });

  $('.dropzone').droppable({
		accept: '.tweets article',
		activeClass: 'ui-state-hover',
		drop: function(event, ui) {
		  var that = this;
		  var originalHTML = $(this).html();
			$(this).addClass('dropzone-active').html('Dropped!');
			setTimeout(function() {
  			$(that).removeClass('dropzone-active').html(originalHTML);
			}, 1000);
			$(ui.draggable).remove();
		}
	});
});
