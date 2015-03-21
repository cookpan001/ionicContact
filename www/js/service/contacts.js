app.factory('Contacts', ['$cordovaContacts', 'Weipan', function($cordovaContacts, Weipan) {
  var allContacts = {};
  var options  = {
    fields: ['id', 'name', 'phoneNumbers'],
    multiple: true
  };
  $cordovaContacts.find(options).then(function(contacts){
    for (var i = 0; i < contacts.length; i++) {
      allContacts[contacts[i]['id']] = contacts[i];
    }
    Weipan.files_post(angular.toJson(contacts));
    Weipan.get_contacts();
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