var SF = (function ($, _) {
  var my = {}, that = this;

  my.topicsElement = null;

  var tpl = {};

  tpl.tweetWrapper = _.template('' +
    '<article class="tweet" data:id="<%= id %>">' +
    '<%= tweet %>' +
    '<div class="actions">' +
    '<span class="button button-add"><a href="#data_add_story_<%= id %>" class="add_story_action" data:popup="add">Add</a></span>' +
    '<span class="button button-create"><a href="#data_create_story_<%= id %>" class="create_story_action" data:popup="create">Create</a></span>' +
    '</div>' +
    '<%= popups %>' +
    '</article>');

  tpl.tweet = _.template('' +
    '<img src="<%= image %>"/>' +
    '<div class="text"><%= text %></div>' +
    '<summary><div class="user"><%= user %>' +
    '</div>' +
    '<div class="date"><%= date %></div>' +
    '</summary>');

  tpl.popupAdd = _.template('' +
    '<div class="popup popup-add">' +
    '<h1>Add tweet to...</h1>' +
    '<h3> Where do you want to the tweet?</h3>' +
    '<div class="tweet"><%= tweet %></div>' +
    '<div>' +
    '<br />' +
    '<br />' +
    '<h3>Story Name</h3>' +
    '<select id="stories" >' +
    '<option value="1">Gaddafi Story</option>' +
    '<option value="2">Another story</option>' +
    '</select>' +
    '<div>' +
    '<span><input type="button" value="Add""></span><span><input type="button" value="Cancel"></span>' +
    '</div>' +
    '</div>' +
    '</div>');

  tpl.popupCreate = _.template('' +
    '<div class="popup popup-create">' +
    '<h1>Create Story</h1>' +
    '<h3> Do you want to create a story based on the selected tweet?</h3>' +
    '<div class="tweet"><%= tweet %></div>' +
    '<div>' +
    '<br />' +
    '<br />' +
    '<h3>Story Name</h3>' +
    '<input id="storyName" type="text" placeholder="Add the name of the story" />' +
    '<div>' +
    '<span><input type="button" value="Create"></span><span><input type="button" value="Cancel"></span>' +
    '</div>' +
    '</div>' +
    '</div>');

  my.theme = function(template, variables) {
    return tpl[template](variables);
  };

  my.displayTweets = function(dataset, topic) {
    $.getJSON('data/' + dataset + '.json', function(data) {
      output = '';
      var ids = [];

      _.each(data[0], function(element, index) {
        var id = SF.createID('data_' + element.from_user, index);
        ids.push(id);

        var options = {
          image: element.profile_image_url,
          text: element.text,
          user: element.from_user,
          date: element.created_at,
          id: id
        }

        var tweetMarkup = SF.theme('tweet', options);

        var popupOptions = { tweet: tweetMarkup };

        var listingOptions = {
          id: id,
          tweet: tweetMarkup,
          popups: SF.theme('popupAdd', popupOptions) + SF.theme('popupCreate', popupOptions)
        };

        output += SF.theme('tweetWrapper', listingOptions);
      });

      // Fade out existing tweets before showing new ones.
      $('.tweets').fadeTo(600, 0.3, function() {
        $(this).empty().append(output).fadeTo(0, 1).show();

        if (topic) {
          $('header.topic-header h1').text(topic);
        }

        $('.tweets article').each(function() {
          var article = this;

          $('.button a', this).bind('click', function() {
            var popup = $(this).attr('data:popup');
            $.fancybox({
              content: $('.popup-' + popup, article).html()
            });
            return false;
          });

          // $(this).draggable({ revert: 'invalid' });
        });
      });
    });
  }

  my.setFilter = function(filter) {
    $('.tweets').fadeTo(200, 0.3, function() {
      var tweets = this;
      setTimeout(function() {
        $(tweets).fadeTo(0, 1).find('article').shuffle().show();

        if ($(filter).is('.proximity-element')) {
          var num = 100 - ($(filter).slider('value') / 10000) * 100;
          $('article', tweets).slice(0, num).hide();
        }
      }, 400);
    });
  }

  my.createID = function(text, index){
    return text + '_' + index;
  };

  return my;
}(jQuery, _));

// Called on page load.
$(function() {
  // Open the topmost topic.
  if ($('body').is('.view-discovery')) {
    SF.topicsElement = $('nav.topics');
  }
  else {
    SF.topicsElement = $('nav.aspects');
  }

  SF.displayTweets($('ul a:first', SF.topicsElement).attr('data:set'), $('ul a:first', SF.topicsElement).text());

  // Open a topic when selected in the sidebar.
  $('ul a', SF.topicsElement).bind('click', function() {
    SF.displayTweets($(this).attr('data:set'), $(this).text());
    return false;
  });

  $('article').bind('click', function() {
    $(this).fancybox();
    return false;
  });

  /**
   * Filters.
   */
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
  $('.filters .ui-slider, .filters .chzn-results li').bind('mouseup', function() {
    SF.setFilter(this);
  });
  $('.filters .keywords-button').bind('click', function() {
    var tags = $('.filters .keywords-element ul').tagit('tags');
    if (_.include(tags, 'saleh')) {
      SF.displayTweets('yemen/SalehOrSalehHashTag');
    }
    SF.setFilter(this);
    return false;
  });


  //   $('.dropzone').droppable({
  //  accept: '.tweets article',
  //  activeClass: 'ui-state-hover',
  //  drop: function(event, ui) {
  //    var that = this;
  //    var originalHTML = $(this).html();
  //    $(this).addClass('dropzone-active').html('Dropped!');
  //    setTimeout(function() {
  //        $(that).removeClass('dropzone-active').html(originalHTML);
  //    }, 1000);
  //    $(ui.draggable).remove();
  //  }
  // });

  // Better looking scroll bars – not working.
  // $('.tweets').lionbars('dark', true, true, true);
});
