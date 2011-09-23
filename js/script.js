var SF = (function ($, _) { 
  var my = {}, that = this;

  var tpl = {};
  tpl.tweet = _.template('<article><img src="<%= image %>"/><div class="text"><%= text %></div><summary><div class="user"><%= user %></div><div class="date"><%= date %></div></summary></article>');

  my.theme = function(template, variables) {
    return tpl[template](variables);
  };

  return my; 
}(jQuery, _));

// Called on page load.
$(function() {
  $.getJSON('troydevis.json', function(data) {
    output = '';
    _.each(data[0], function(element, index) {
      output += SF.theme('tweet', {
        image: element.profile_image_url,
        text: element.text,
        user: element.from_user,
        date: element.created_at,
      });
    });
    $('.view.discovery .tweets').append(output);
    $('.view.discovery').show();
  });
});
