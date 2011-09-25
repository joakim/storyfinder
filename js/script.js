var SF = (function ($, _) { 
  var my = {}, that = this;

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

      $('.view.discovery .tweets').empty().append(output);
      $('.topic-header h1').text($element.text());
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
});
