angular.module('projectArklay').factory('SettingsFactory', function(){
  // settings is the object that's actually returned, but defaultSettings needs to be stored so they can be reset
  // so just call SettingsFactory.getDefaults() in the controller to initialise the settings
  var settings = {};
  var defaultSettings = {
    'open' : false,
    'backgroundColourOpen' : false,
    'menuColourOpen' : false,
    'textColourOpen' : false,
    'menuTextColourOpen' : false,
    'optionsOpen' : false,
    'soundEnabled' : true
  };
  return{
    getDefaults:
    function(){
      settings = defaultSettings
      return settings;
    },
    // Display panels, open/closed
    setDisplay:
    function(setting){
      settings.open = setting;
      return settings.open;
    },
    setBackgroundColourDisplay:
    function(setting){
      settings.backgroundColourOpen = setting;
      return settings.backgroundColourOpen;
    },
    setMenuColourDisplay:
    function(setting){
      settings.menuColourOpen = setting;
      return settings.menuColourOpen;
    },
    setTextColourDisplay:
    function(setting){
      settings.textColourOpen = setting;
      return settings.textColourOpen;
    },
    setMenuTextColourDisplay:
    function(setting){
      settings.menuTextColourOpen = setting;
      return settings.menuTextColourOpen;
    },
    setOptionsDisplay:
    function(setting){
      settings.optionsOpen = setting;
      return settings.optionsOpen;
    },
    setSound:
    function(setting){
      settings.soundEnabled = setting;
      return settings.soundEnabled;
    }
  }
});
