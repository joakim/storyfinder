var SF = (function ($, _) { 
  var my = {}, that = this;
  var rand_no = Math.random();
  var seed = 1000000000000;
  var tpl = {};
  tpl.tweet = _.template('' +
      '<article><img src="<%= image %>"/>' +
      '<div class="text"><%= text %></div>' +
      '<summary><div class="user"><%= user %>' +
      '</div>' +
      '<div class="date"><%= date %></div>' +
      '<div class="actions">' +
      '<span class="create"><a id="create_story_<%= id %>" href="#data_create_story_<%= id %>" class="create_story_action">Create</a>' +
      '<div style="display:none"><div id="data_create_story_<%= id %>" style="width:400px;">' +
      '<h1>Create Story</h1>' +
      '<h3> Do you want to create a story based on the selected tweet?</h3>' +
      '<div>Date: <%= date %></div>'+
      '<div><img src="<%= image %>" /><span style="font-weight: bold">  <%= user %></span></div>'+
      '<div>Tweet: <%= text %></div>'+
      '<div>' +
      '<br />' +
      '<br />' +
      '<h3>Story Name</h3>' +
      '<input id="storyName" type="text" placeholder="Add the name of the story" />' +
      '<div>' +
      '<span><input type="button" value="Create"></span><span><input type="button" value="Cancel"></span>' +
      '</div>' +
      '</div>'+
      '</div>' +
      '</div>' +
      '</span>' +
      '<span class="add"><a id="add_story_<%= id %>" href="#data_add_story_<%= id %>" class="add_story_action">Add</a>' +
      '<div style="display:none"><div id="data_add_story_<%= id %>" style="width:400px;">' +
      '<h1>Add tweet to...</h1>' +
      '<h3> Where do you want to the tweet?</h3>' +
      '<div>Date: <%= date %></div>'+
      '<div><img src="<%= image %>" /><span style="font-weight: bold">  <%= user %></span></div>'+
      '<div>Tweet: <%= text %></div>'+
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
      '</div>'+
      '</div>' +
      '</div>' +
      '</span>' +
      '</div>' +
      '</summary>' +
      '</article>');

  my.theme = function(template, variables) {
    return tpl[template](variables);
  };
  my.createID = function(text, index){
      return text + "_" + index;
  };
  return my; 
}(jQuery, _));

// Called on page load.
$(function() {
  
  var ids = [];
  $.getJSON('troydevis.json', function(data) {
    output = '';

    _.each(data[0], function(element, index) {
      var id = SF.createID("data_"+ element.from_user, index);
      ids.push(id);
      
      output += SF.theme('tweet', {
        image: element.profile_image_url,
        text: element.text,
        user: element.from_user,
        date: element.created_at,
        id: id
      });


    });
    
    $('.view.discovery .tweets').append(output);
    $('.view.discovery').show();
    ids.forEach(function(value, index){
          $("#add_story_"+value).bind('click', function(){
              $("#"+this.id).fancybox();
          });
          $("#create_story_"+value).bind('click', function(){
              $("#"+this.id).fancybox();
          });
      });
  });

});
