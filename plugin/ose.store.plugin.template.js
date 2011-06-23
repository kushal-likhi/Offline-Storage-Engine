var myPlugin = {
    initializeStore:function(obj) {
    },
    add:function(obj, record) {
    },
    remove:function(obj, record) {
    },
    removeAll:function(obj) {
    },
    update:function(obj, record, newRecord) {
    },
    read:function(obj, sid) {
    },
    readAll:function(obj) {
    },
    getDataJSON:function(obj) {
    },
    getDeletedDataJSON:function(obj) {
    },
    getDeleted:function(obj) {
    },
    clearDeleted:function(obj) {
    },
    find:function(object, model) {
    },
    getCount: function(obj) {
    },
    enrich: function(obj) {
       //ex: obj.extStore = obj.store;
    }
};

//Important part, Register plugin storeManager with OSE
ose.domain.storeManager = myPlugin;