(function (){

  var App = {};

  $(function(){
    var data = {
      choices: [
        {
          name: "Plan 1",
          description: "Plan option 1",
          type: "plan",
          cost: 1000
        },
        {
          name: "Plan 2",
          description: "Plan option 2",
          type: "plan",
          cost: 1200
        },
        {
          name: "Roof 1",
          description: "Roof option 1",
          type: "roof",
          cost: 2300
        },
        {
          name: "Roof 2",
          description: "Roof option 2",
          type: "roof",
          cost: 2139
        },
        {
          name: "Windows 1",
          description: "Windows option 1",
          type: "window",
          cost: 1000
        },
        {
          name: "Windows 2",
          description: "Windows option 2",
          type: "window",
          cost: 1200
        }
      ]
    };

    var dataTypes = _(data.choices).groupBy(function(item){
      return item.type;
    });

    App.designChoices = new Backbone.Collection(data.choices, {parse: true});

    var planChoices = new Backbone.Collection(App.designChoices.where({type: "plan"}), {parse: true});
    var roofChoices = new Backbone.Collection(App.designChoices.where({type: "roof"}), {parse: true});
    var windowChoices = new Backbone.Collection(App.designChoices.where({type: "window"}), {parse: true});

    var collectionTabMap = {
      'plan': planChoices,
      'roof': roofChoices,
      'window': windowChoices
    };

    var BaseView = Backbone.View.extend({
      render: function(){
        var data = this.model ? this.model.toJSON() : {};
        this.$el.html(this.template(data));
        return this;
      }
    });

    var TabView = BaseView.extend({
      el: ".design-choices-tabs",
      events: {
        'click a': function(e){
          this.trigger('tabSelect', $(e.currentTarget).attr('href').substr(1));
        }
      },
      render: function(){

      }
    });

    var OptionsView = BaseView.extend({
      template: Handlebars.compile($('#options-template').html()),
      events: {
        'click input': 'optionSelected'
      },
      optionSelected: function(e){
        var optionName = $(e.currentTarget).val();
        var selectedOption = this.collection.find(function(option){
          return option.get('name') == optionName;
        });
        this.trigger('optionSelected', selectedOption);
      },
      render: function(){
        if (this.collection) {
          this.$el.html(this.template(this.collection.toJSON()));
        }
        return this;
      }
    });

    var ChoiceInfoView = BaseView.extend({
      template: Handlebars.compile($('#choice-info-template').html())
    });

    var choiceInfoView = new ChoiceInfoView();
    $('#choice-info').html(choiceInfoView.render().el);

    App.optionsView = new OptionsView({
      collection: planChoices
    });
    App.optionsView.$el.appendTo("#options-panel");
    App.optionsView.render();
    App.optionsView.on('optionSelected', function(option){
      var choiceInfoView = new ChoiceInfoView({model: option});
      $('#choice-info').html(choiceInfoView.render().el);
    });


    App.tabView = new TabView();
    App.tabView.on('tabSelect', function(tab){
      App.optionsView.collection = collectionTabMap[tab];
      App.optionsView.render();
    });
  });

  window.App = App;
})();
