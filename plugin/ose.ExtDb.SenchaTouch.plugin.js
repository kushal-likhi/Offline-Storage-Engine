var extDbPlugin = {
    initializeStore:function(obj) {
        var model = [];
        for (i = 0; i < obj.fields.length; i++) {
            model[i] = {name:obj.fields[i]};
        }
        obj.model = Ext.regModel(obj.id, {
            fields:model
        });
        var eds = new Ext.data.Store({
            model: obj.id,
            proxy: {
                type: 'localstorage',
                id: obj.id
            }
        });
        var eds_d = new Ext.data.Store({
            model: obj.id,
            proxy: {
                type: 'localstorage',
                id: obj.id + "_del"
            }
        });
        eds.load();
        eds_d.load();
        obj.extStore_del = eds_d;
        return eds;
    },
    add:function(obj, model) {
        var record = new obj.model();
        for (i = 0; i < obj.fields.length; i++) {
            record.set(obj.fields[i], model[obj.fields[i]]);
        }
        obj.extStore.add(record);
        obj.extStore.sync();
    },
    remove:function(obj, record) {
        obj.extStore.each(function(extRecord) {
            var isSame = true;
            for (att in record) {
                if (record[att] + "" != extRecord.data[att]) {
                    isSame = false;
                }
            }
            if (isSame) {
                obj.extStore.remove(extRecord);
                var record_d = new obj.model();
                for (i = 0; i < obj.fields.length; i++) {
                    record_d.set(obj.fields[i], extRecord.data[obj.fields[i]]);
                }
                obj.extStore_del.add(record_d);
                obj.extStore_del.sync();
            }
        });
        obj.extStore.sync();
    },
    removeAll:function(obj) {
        obj.extStore.each(function(extRecord){

        });
        obj.extStore.removeAll();
        obj.extStore.sync();
    },
    update:function(obj) {

    },
    read:function(obj) {
    },
    readAll:function(obj) {
        var arr = [];
        obj.extStore.each(function(extRecord) {
            var record = {};
            for (i = 0; i < obj.fields.length; i++) {
                record[obj.fields[i]] = extRecord.data[obj.fields[i]];
            }
            arr.push(record)
        });
        return arr;
    },
    getDataJSON:function(obj) {
    },
    getDeletedDataJSON:function(obj) {
    },
    getDeleted:function(obj) {
    },
    clearDeleted:function(obj) {
    },
    find:function(obj) {
    },
    getCount: function(obj) {
        return obj.extStore.getCount();
    },
    enrich: function(obj) {
        obj.extStore = obj.store;
    }
};

//Important part, Register plugin storeManager with OSE
ose.domain.storeManager = extDbPlugin;