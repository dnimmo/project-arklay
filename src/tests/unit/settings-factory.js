describe('Settings Factory', function(){
  var SettingsFactory;
  var defaultSettings = {
    'open' : false,
    'backgroundColourOpen' : false,
    'menuColourOpen' : false,
    'textColourOpen' : false,
    'menuTextColourOpen' : false,
    'optionsOpen' : false,
    'soundEnabled' : true
  };
  
  beforeEach(module('projectArklay'))
  
  beforeEach(inject(function(_SettingsFactory_){
    SettingsFactory = _SettingsFactory_;
  }));
  
  it('should be able to give the player the default settings', function(){
    var testSettings = SettingsFactory.getDefaults();
    
    expect(testSettings).toEqual(defaultSettings);
  });
  
  describe('should be able to set ', function(){
  
    it('the settings panel to be open/closed', function(){
      var testDisplaySetting = SettingsFactory.setDisplay(true);
      expect(testDisplaySetting).toEqual(true);
    })
    
   it('the background colour panel to be open/closed', function(){
      var testDisplaySetting = SettingsFactory.setBackgroundColourDisplay(true);
      expect(testDisplaySetting).toEqual(true);
    })
   
    it('the menu colour panel to be open/closed', function(){
      var testDisplaySetting = SettingsFactory.setMenuColourDisplay(true);
      expect(testDisplaySetting).toEqual(true);
    })
    
    it('the text colour panel to be open/closed', function(){
      var testDisplaySetting = SettingsFactory.setTextColourDisplay(true);
      expect(testDisplaySetting).toEqual(true);
    })
    
    it('the menu text colour panel to be open/closed', function(){
      var testDisplaySetting = SettingsFactory.setMenuTextColourDisplay(true);
      expect(testDisplaySetting).toEqual(true);
    })
    
    it('the options panel to be open/closed', function(){
      var testDisplaySetting = SettingsFactory.setOptionsDisplay(true);
      expect(testDisplaySetting).toEqual(true);
    })
    
    it('sound to be enabled/disabled', function(){
      var testDisplaySetting = SettingsFactory.setSound(true);
      expect(testDisplaySetting).toEqual(true);
    })
  }) 
})
