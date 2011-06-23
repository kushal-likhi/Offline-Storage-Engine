var handler = new Object();
handler.listItemClick = function(id) {
    var html;
    helloWorld.offlineStore.each(function(record) {
        if (record.data.id == id) {
            html = templateManager.build.detailsPage(record.data.name, record.data.id, record.data.age, record.data.company, record.data.city);
        }
    });
    if (html == null) {
        html = "Not Found!!";
    }
    var height = ose.client.size.height;
    var width = ose.client.size.width;
    var osdStatus = document.createElement("div");
    osdStatus.innerHTML = html + "<br><br><h1 align='center'><button onclick='handler.listItemBack()'>Back</button></h1>";
    osdStatus.id = "osdDet";
    osdStatus.style.backgroundColor = "#ffffff";
    osdStatus.style.position = "fixed";
    osdStatus.style.zIndex = 999;
    osdStatus.style.top = "0px";
    osdStatus.style.height = height + "px";
    osdStatus.style.width = width + "px";
    osdStatus.style.left = "0px";
    osdStatus.style.overflow = "none";
    osdStatus.align = "center";
    document.getElementsByTagName("body").item(0).appendChild(osdStatus);
};
handler.listItemBack = function() {
    document.getElementsByTagName('body')[0].removeChild(document.getElementById("osdDet"));
};
handler.updateEmployee = function() {
    if(gval("iid") == "NA"){
        return
    }
    var url = links.update + "?name=" + gval("name") + "&age=" + gval("age") + "&city=" + gval("city") + "&company=" + gval("company") + "&id=" + gval("iid");
    if (ose.info.isOnline) {
        ose.ajax.send("GET", url, function() {
            alert("Updated Sucsessfully");
            //reloadStores();
        });
    } else {
        ose.storage.addInQueue("update " + url);
        updatePendingTasks();
        alert("Updated But not reflected on the Server")
    }
    storeManager.ext.updateRecord(gval("iid"));
    handler.listItemBack();
};
handler.deleteEmployee = function() {
     if(gval("iid") == "NA"){
        return
    }
    var url = links.del + "?id=" + gval("iid");
    if (ose.info.isOnline) {
        ose.ajax.send("GET", url, function() {
            alert("Deleted Sucsessfully");
            //reloadStores();
        });
    } else {
        ose.storage.addInQueue("delete " + url);
        updatePendingTasks();
        alert("Deleted But not reflected on the Server")
    }
    storeManager.ext.deleteRecord(gval("iid"));
    handler.listItemBack();
};
handler.createEmployee = function() {
    var url = links.create + "?name=" + gval("cname") + "&age=" + gval("cage") + "&city=" + gval("ccity") + "&company=" + gval("ccompany");
    if (ose.info.isOnline) {
        ose.ajax.send("GET", url, function() {
            alert("Created Sucsessfully");
            reloadStores();
        });
    } else {
        ose.storage.addInQueue("create " + url);
        updatePendingTasks();
        alert("Created But not reflected on the server")
        storeManager.ext.createRecord();
    }
    document.getElementsByClassName("newForm")[0].innerHTML = tform;
};
handler.online = function() {
    try {
        var q = ose.storage.fetchQueue();
        if (q.length > 0) {
            ose.osdHandler.generateTopBox("Synchronising.. Please Wait..");
            for (i = 0; i < q.length; i++) {
                var s = new String(q[i]).split(' ');
                switch (s[0]) {
                    case "create":
                        ose.ajax.send("GET", s[1], function() {
                        });
                        //alert("cre" + s[1]);
                        break;
                    case "update":
                        ose.ajax.send("GET", s[1], function() {
                        });
                        //alert("up" + s[1]);
                        break;
                    case "delete":
                        ose.ajax.send("GET", s[1], function() {
                        });
                        //alert("del" + s[1]);
                        break;
                }
            }
        }
    } catch(c) {
        alert("error")
    }
    ose.storage.emptyQueue();
    reloadStores();
    updatePendingTasks();
    ose.osdHandler.generateTopBox("online");
};
var helloWorld = new Ext.Application({
    launch: function() {
        this.tabs = new Ext.TabPanel({
            fullscreen: true,
            dockedItems: [
                {xtype:'toolbar', title:'OffLine POC'}
            ],
            tabBar: {
                ui: 'light',
                layout: {
                    pack: 'center'
                }
            },
            items: [
                {cls:'hello', title:'H'},
                {
                    cls:'employees',
                    title:'Employees',
                    xtype: 'list',
                    store: null,
                    itemTpl:'<div onclick="handler.listItemClick(\'{id}\')"><img src="{imgUrl}" /> &nbsp; {name}</div>'

                },
                {cls: 'newForm', title: 'Create'},
                {cls: 'pc', title: 'P'}

            ]
        });
        this.employees = this.tabs.items.getAt(1);
        this.onlineStore.addListener('load', function () {
            helloWorld.employees.bindStore(helloWorld.onlineStore);
            ose.log("I think we are online");
            helloWorld.offlineStore.proxy.clear();
            this.each(function (record) {
                var employee = helloWorld.offlineStore.add(record.data)[0];
                employee.setImgUrl();
            });
            helloWorld.offlineStore.sync();
            helloWorld.employees.bindStore(helloWorld.offlineStore);
        });
        this.onlineStore.load();
        ose.ajax.send("GET", links.createForm, function(data) {
            tform = data;
        });
        document.getElementsByClassName("newForm")[0].innerHTML = tform;
        updatePendingTasks();
        templateManager.loadDetailsPage();
    },
    Employee: Ext.regModel('Employee', {
        fields:[
            {name:'id'},
            {name:'name'},
            {name:'age'},
            {name:'company'},
            {name:'city'},
            {name:'imgUrl'}
        ],
        setImgUrl: function() {
            var url = links.empImg;
            this.set('imgUrl', url);
        }
    }),
    onlineStore: new Ext.data.Store({
        model: 'Employee',
        proxy: new Ext.data.HttpProxy({
            url: links.emplist,
            timeout: 2000,
            listeners: {
                exception:function () {
                    ose.log("I think we are offline");
                    helloWorld.employees.bindStore(helloWorld.offlineStore);
                    helloWorld.offlineStore.load();
                }
            }
        }),
        reader:new Ext.data.JsonReader({
            //root: 'employee'
        })
    }),
    offlineStore: new Ext.data.Store({
        model: 'Employee',
        proxy: {
            type: 'localstorage',
            id: 'helloworld'
        }
    })
});

function getDetailsPage(id) {
    var da;
    ose.ajax.send("GET", links.empDetail + "/" + id, function(data) {
        da = data
    });
    return da;
}
function gval(id) {
    return document.getElementById(id).value
}
function reloadStores() {
    helloWorld.offlineStore.removeAll();
    helloWorld.onlineStore.removeAll();
    helloWorld.onlineStore.load();
}
var storeManager = new Object();
storeManager.ext = {
    deleteRecord: function(id) {
        helloWorld.offlineStore.each(function(record) {
            if (record.data.id == id) {
                helloWorld.offlineStore.remove(record);
            }
        });
        helloWorld.onlineStore.each(function(record) {
            if (record.data.id == id) {
                helloWorld.onlineStore.remove(record);
            }
        });
    },
    updateRecord: function(id) {
        helloWorld.offlineStore.each(function(record) {
            if (record.data.id == id) {
                record.set('name', gval("name"));
                record.set('age', gval("age"));
                record.set('city', gval("city"));
                record.set('company', gval("company"));
                record.set('id', gval("iid"));
            }
        });
        helloWorld.onlineStore.each(function(record) {
            if (record.data.id == id) {
                record.set('name', gval("name"));
                record.set('age', gval("age"));
                record.set('city', gval("city"));
                record.set('company', gval("company"));
                record.set('id', gval("iid"));
            }
        });

    },
    createRecord: function() {
        var emp = new helloWorld.Employee();
        emp.setImgUrl();
        emp.set('name', gval("cname"));
        emp.set('age', gval("cage"));
        emp.set('city', gval("ccity"));
        emp.set('company', gval("ccompany"));
        emp.set('id', "NA");
        helloWorld.onlineStore.add(emp);
        helloWorld.offlineStore.add(emp);
    }
};
function updatePendingTasks() {
    var inHtml = "";
    if (ose.storage.queueSize() == 0) {
        inHtml = "<br> <strong> NO Pending Offline Tasks</strong>";
    } else {
        var q = ose.storage.fetchQueue();
        if (q.length > 0) {
            for (i = 0; i < q.length; i++) {
                var s = new String(q[i]).split(' ');
                inHtml = inHtml + "<br> ->" + s[0] + " Employee";
            }
        }
    }
    document.getElementsByClassName("pc")[0].innerHTML = "<div style='opacity:.8;background-color:#f0e68c;width:100%;height:100%'><h1 align='center'>Pending Tasks</h1>" + inHtml + "</div>";
}
var templateManager = new Object();
templateManager.templates = new Object();
templateManager.load = function(url) {
    var ret;
    ose.ajax.send("GET", url, function(data) {
        ret = data
    });
    return ret;
};
templateManager.loadDetailsPage = function() {
    templateManager.templates.detailsPage = templateManager.load(links.detailsTpl);
};
templateManager.build = {
    detailsPage: function(name, id, age, company, city) {
        var ret = new String(templateManager.templates.detailsPage);
        ret = ret.replace("##name##", name);
        ret = ret.replace("##id##", id);
        ret = ret.replace("##age##", age);
        ret = ret.replace("##company##", company);
        ret = ret.replace("##city##", city);
        if(id == "NA"){
           ret = ret+ "<br><br><h1 align='center'>This Record is not yet Synchronised with server.<br>Update and Delete will not work</h1>"
        }
        return ret;
    }
};

var tform;