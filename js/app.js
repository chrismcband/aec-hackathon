(function (){
  var App = {};


  var data = {
    choices: [
      {
        name: "Floor 1",
        type: "Floor"
      },
      {
        name: "Floor 2",
        type: "Floor"
      },
      {
        name: "Floor 3",
        type: "Floor"
      }
    ]
  };

  App.BaseView = Backbone.View.extend({
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  App.TabView = App.BaseView.extend({
    template: Handlebars.compile($('#design-tabs-template').html())
  });

  App.OptionView = Backbone.View.extend({
    template: Handlebars.compile($('#option-template').html())
  });

  var dataTypes = _(data.choices).groupBy(function(item){
    return item.type;
  });



  window.App = App;
})();
