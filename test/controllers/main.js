'use strict';

describe('Controller: mainController', function () {
  
  // load the controller's module
  beforeEach(module('app'));
  
  var mainCtrl, scope;
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      mainCtrl = $controller('mainController', {
        $scope: scope,
      });
  }));
  
  it('default page', function () {
    expect(scope.keyupObservers).toBeDefined();
  });
});

describe('Controller: calculatorController', function () {
  
  // load the controller's module
  beforeEach(module('app'));
  
  var calculatorController, scope;
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
      $rootScope.keyupObservers = [];
      scope = $rootScope.$new();
      calculatorController = $controller('calculatorController', {
        $routeParams: {type : 'basic'},
        $scope: scope
      });  
  }));
  
  it('The calculator should be defined', function () {
    expect(scope.calculator).toBeDefined();
  });
  it('The calculator value be 0', function () {
    expect(scope.calculator.value).toBe('0');
  });
  function clickButton(components, text, calculator){
    angular.forEach(components, function(group, index) {
      angular.forEach(group, function(component, index) {
        if (component.text === text){
          component.onclick();
          console.log(calculator.value);
        }
      });
    });
  }
  it('Type 123', function () {
    clickButton(scope.calculator.components, '1', scope.calculator);
    clickButton(scope.calculator.components, '2', scope.calculator);
    clickButton(scope.calculator.components, '3', scope.calculator);
    //scope.calculator.components[]
    expect(scope.calculator.value).toBe('123');
  });
});
