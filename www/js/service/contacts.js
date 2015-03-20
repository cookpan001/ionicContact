app.factory('Contacts', ['$cordovaContacts', function($cordovaContacts) {
  var allContacts = {};
  var options  = {
    fields: ['id', 'name', 'phoneNumbers'],
    multiple: true
  };
  $cordovaContacts.find(options).then(function(contacts){
    for (var i = 0; i < contacts.length; i++) {
      allContacts[contacts[i]['id']] = contacts[i];
    }
    console.log(allContacts);
  }, function(contactError){
    console.log(contactError);
  });
  return {
    all: function(){
      return allContacts;
    },
    remove: function(id){
      delete allContacts[id];
    },
    get: function(id){
      return allContacts[id];
    }
  };
}]);