(function (){

  var App = {};

  $(function(){
    var data = {
      choices: [
        {
          name: "Plan 1",
          description: "Plan option 1",
          type: "plan",
          cost: 1000,
          carbon: 20494,
          hasModel: true
        },
        {
          name: "Plan 2",
          description: "Plan option 2",
          type: "plan",
          cost: 1200,
          carbon: 20494,
          hasModel: true
        },
        {
          name: "Roof 1",
          description: "Roof option 1",
          type: "roof",
          cost: 2300,
          carbon: 20393,
          hasModel: true
        },
        {
          name: "Roof 2",
          description: "Roof option 2",
          type: "roof",
          cost: 2139,
          carbon: 19348,
          hasModel: true
        },
        {
          name: "Windows 1",
          description: "Windows option 1",
          type: "window",
          cost: 1000,
          carbon: 12398,
          hasModel: false
        },
        {
          name: "Windows 2",
          description: "Windows option 2",
          type: "window",
          cost: 1200,
          carbon: 22398,
          hasModel: false
        }
      ]
    };

    var dataTypes = _(data.choices).groupBy(function(item){
      return item.type;
    });

    var designChoices = new Backbone.Collection(data.choices, {parse: true});
    var myDesignChoices = new Backbone.Collection();

    var planChoices = new Backbone.Collection(designChoices.where({type: "plan"}), {parse: true});
    var roofChoices = new Backbone.Collection(designChoices.where({type: "roof"}), {parse: true});
    var windowChoices = new Backbone.Collection(designChoices.where({type: "window"}), {parse: true});

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
      initialize: function(options){
        this.selectedOption = options.selectedOption;
      },
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
        if (this.selectedOption) {
          this.$('[value="'+this.selectedOption.get('type')+'"]').click();
        }

        return this;
      }
    });

    var ChoiceInfoView = BaseView.extend({
      template: Handlebars.compile($('#choice-info-template').html())
    });

    var SummaryView = BaseView.extend({
      template: Handlebars.compile($('#summary-template').html()),
      initialize: function(){
        this.listenTo(this.collection, 'add', this.render);
      },
      serializeData: function(){
        var data = {
          cost: 0,
          carbon: 0
        };
        this.collection.each(function(option){
          data.cost += option.get('cost');
          data.carbon += option.get('carbon');
        });

        return data;
      },
      render: function(){
        this.$el.html(this.template(this.serializeData()));
        return this;
      }
    });

    var choiceInfoView = new ChoiceInfoView();
    $('#choice-info').html(choiceInfoView.render().el);

    App.optionsView = new OptionsView({collection: planChoices});
    App.optionsView.$el.appendTo("#options-panel");
    App.optionsView.render();
    App.optionsView.on('optionSelected', function(option){
      var choiceInfoView = new ChoiceInfoView({model: option});
      $('#choice-info').html(choiceInfoView.render().el);

      var sameTypeChoices = myDesignChoices.filter(function(choice){
        return choice.get('type') == option.get('type');
      });
      myDesignChoices.remove(sameTypeChoices);
      myDesignChoices.add(option);
    });

    App.tabView = new TabView();
    App.tabView.on('tabSelect', function(tab){
      var selectedOption = myDesignChoices.find(function(option){
        return option.get('type') == tab;
      });
      var optionsView = new OptionsView({
        collection: collectionTabMap[tab],
        selectedOption: selectedOption
      });
      $('#options-panel').html(optionsView.render().el);
    });

    App.summaryView = new SummaryView({collection: myDesignChoices});
    $('#summary-panel').html(App.summaryView.render().el);
  });

  window.App = App;
})();
