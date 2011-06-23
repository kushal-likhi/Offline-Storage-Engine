/**
 * Created by IntelliJ IDEA.
 * User: kushal
 * Date: 6/18/11
 * Time: 9:01 AM
 * To change this template use File | Settings | File Templates.
 *
 * ose
 * boolean ose.info.supportsOfflineStorage
 * object ose.appcache
 * string ose.info.appcacheType
 * boolean ose.info.isOnline
 * boolean ose.info.isPageCached
 * boolean ose.settings.osd.online
 * boolean ose.settings.osd.offline
 *
 */

var ose = new Object();
var a = new Object();
var ex = new Object();
ose.util = {
    detectOfflineStorageAvailability: function() {
        ose.info.supportsOfflineStorage = false;
        try {
            if (window.applicationCache) {
                ose.info.supportsOfflineStorage = true;
                ose.appcache = window.applicationCache;
                ose.info.appcacheType = "window.applicationCache";
            } else if (!ose.info.supportsOfflineStorage && Modernizr.applicationcache) {
                ose.info.supportsOfflineStorage = true;
                ose.appcache = Modernizr.applicationcache;
                ose.info.appcacheType = "Modernizr.applicationcache";
            }
        } catch(c) {
            ose.log("Error in Determining HTML5 Support")
        }
    },
    init: function() {
        ose.info.appcacheType = "not Available";
        ose.util.detectOfflineStorageAvailability();
    }
};
ose.events = {
    online: function() {
        ose.info.isOnline = true;
        if (ose.settings.osd.online) {
            ose.osdHandler.generateTopBox("Online");
            ose.log("Browser Online");
        }
        //handler.online();
    },
    offline: function() {
        ose.info.isOnline = false;
        if (ose.settings.osd.offline) {
            ose.osdHandler.generateTopBox("Offline");
            ose.log("Browser Offline");
        }
    },
    onchecking: function(e) {
        ose.log("checking, Please Wait...");
    },
    ondownloading: function(e) {
        ose.log("Downloading...");
    },
    onupdateready: function(e) {
        ose.log("Update Ready");
    },
    onobsolete: function(e) {
        ose.log("Obsolete");
    },
    oncached: function(e) {
        ose.log("Cached");
    },
    onerror: function(e) {
        ose.log("Error");
    },
    onnoupdateready: function(e) {
        ose.log("Update Ready");
    },
    onprogress: function(e) {
        ose.log("Progress Update");
    },
    onnoupdate: function(e) {
        ose.log("NO Manifest Updates")
    },
    init: function() {
        window.addEventListener("online", ose.events.online, true);
        window.addEventListener("offline", ose.events.offline, true);
        ose.appcache.onchecking = ose.events.onchecking;
        ose.appcache.ondownloading = ose.events.ondownloading;
        ose.appcache.onupdateready = ose.events.onupdateready;
        ose.appcache.onobsolete = ose.events.onobsolete;
        ose.appcache.oncached = ose.events.oncached;
        ose.appcache.onerror = ose.events.onerror;
        ose.appcache.onnoupdateready = ose.events.onnoupdateready;
        ose.appcache.onprogress = ose.events.onprogress;
        ose.appcache.onnoupdate = ose.events.onnoupdate;
        ose.osdHandler.showOOStatus();
    }
};
ose.client = {
    getSize: function() {
        if (typeof( window.innerWidth ) == 'number') {
            ose.client.size.width = window.innerWidth;
            ose.client.size.height = window.innerHeight;
        }
        else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            ose.client.size.width = document.documentElement.clientWidth;
            ose.client.size.height = document.documentElement.clientHeight;
        }
        else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
            ose.client.size.width = document.body.clientWidth;
            ose.client.size.height = document.body.clientHeight;
        }
    },
    size: {},
    init: function() {
        ose.client.getSize()
    }
};
ose.osdHandler = {
    showOOStatus:function() {
        if (ose.info.isOnline) {
            ose.events.online();
        } else {
            ose.events.offline();
        }
    },
    generateTopBox: function(text) {
        if (document.getElementById("osdStatus")) {
            document.getElementsByTagName("body").item(0).removeChild(document.getElementById("osdStatus"));
        }
        var size = new String(text).length;
        var width = (size * 10) + 10;
        var osdStatus = document.createElement("div");
        osdStatus.innerHTML = text;
        osdStatus.style.color = "#ffffff";
        osdStatus.style.fontSize = "12px";
        osdStatus.style.fontWeight = "bold";
        osdStatus.id = "osdStatus";
        osdStatus.style.backgroundColor = "#ff0000";
        osdStatus.style.position = "fixed";
        osdStatus.style.zIndex = 999;
        osdStatus.style.top = "0px";
        osdStatus.style.height = "16px";
        osdStatus.style.width = width + "px";
        osdStatus.style.left = Math.floor((ose.client.size.width - width) / 2) + "px";
        osdStatus.align = "center";
        document.getElementsByTagName("body").item(0).appendChild(osdStatus);
    },
    generateConsole:function() {
        var console = document.createElement("div");
        console.style.fontSize = "12px";
        console.style.fontWeight = "bold";
        console.style.color = "#fff";
        console.style.backgroundColor = "#000";
        //console.style.border = "3px solid #fff";
        console.style.padding = "0px";
        console.style.margin = "0px";
        console.style.position = "fixed";
        console.style.zIndex = 999;
        console.style.overflow = "auto";
        console.style.width = "100%";
        console.style.height = "28%";
        console.style.left = "0px";
        console.style.top = "66%";
        console.readOnly = true;
        console.id = "osecta";
        document.getElementsByTagName("body").item(0).appendChild(console);
        console = document.createElement("div");
        console.style.fontSize = "12px";
        console.style.fontWeight = "bold";
        console.style.color = "#fff";
        console.style.backgroundColor = "#666";
        //console.style.border = "3px solid #fff";
        console.style.padding = "0px";
        console.style.margin = "0px";
        console.style.position = "fixed";
        console.style.zIndex = 999;
        console.style.width = "100%";
        console.style.left = "0px";
        console.style.height = "6%";
        console.style.top = "60%";
        console.id = "osehbc";
        console.innerHTML = "<h4 style='padding:0px;margin:0px' align='center'>OSE Console</h4><button style='padding:0px;margin:0px;float:right;position:absolute;top:0%;width:8%;left:90%' onclick='ose.osdHandler.consoleShowHide()'>Show/Hide</button>";
        document.getElementsByTagName("body").item(0).appendChild(console);
        console = document.createElement("input");
        console.style.fontSize = "12px";
        console.style.fontWeight = "bold";
        console.style.color = "#fff";
        console.style.backgroundColor = "#000";
        //console.style.border = "3px solid #fff";
        console.style.padding = "0px";
        console.style.margin = "0px";
        console.style.position = "fixed";
        console.style.zIndex = 999;
        console.style.width = ose.client.size.width - 100 + "px";
        console.style.left = "100px";
        console.style.height = "6%";
        console.style.top = "94%";
        console.id = "osecin";
        console.onkeydown = ose.osdHandler.consoleExec;
        document.getElementsByTagName("body").item(0).appendChild(console);
        console = document.createElement("input");
        console.style.fontSize = "12px";
        console.style.fontWeight = "bold";
        console.style.color = "#fff";
        console.style.backgroundColor = "#000";
        //console.style.border = "3px solid #fff";
        console.style.padding = "0px";
        console.style.margin = "opx";
        console.style.position = "fixed";
        console.style.zIndex = 999;
        console.style.width = "100px";
        console.style.left = "0px";
        console.style.height = "6%";
        console.style.top = "94%";
        console.readOnly = true;
        console.value = "Command ->";
        console.id = "ccmdsp";
        document.getElementsByTagName("body").item(0).appendChild(console);
    },
    console: function(text, col) {
        if (!ose.settings.osd.console) {
            return null;
        }
        text = "$(" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + ")> <span style='color:" + col + "'>" + text + "</span>";
        var con = document.getElementById("osecta");
        con.innerHTML = con.innerHTML + text + "<br>";
        con.scrollTop = con.scrollHeight;
    },
    consoleExec : function(e) {
        if (e.keyCode == 13) {
            var scr = document.getElementById("osecin").value;
            ose.osdHandler.stack.push(scr);
            ose.osdHandler.currentIndex = ose.osdHandler.stack.length;
            ose.log(scr, "green");
            document.getElementById("osecin").value = "";
            try {
                var cmm = new String(scr).split(' ');
                switch (cmm[0]) {
                    case "echo":
                        try {
                            eval("ose.log(" + cmm[1] + ",'yellow')");
                        } catch(c) {
                            ose.log("Invalid argument", "red")
                        }
                        break;
                    case "clear":
                        document.getElementById("osecta").innerHTML = "";
                        ose.log("OSE Console Cleared");
                        break;
                    case "export":
                        eval("ex." + cmm[1] + " = " + cmm[2]);
                        break;
                    case "alias":
                        eval("a." + cmm[1] + " = " + cmm[2]);
                        break;
                    case "edit":
                        eval("ose.osdHandler.getFunc(" + cmm[1] + ")");
                        ose.osdHandler.launchEditor(a.evalOSD1234, cmm[1]);
                        break;
                    case "prop-f":
                        eval("var o = " + cmm[1] + ";for (att in o) {ose.log('<span style=color:yellow>' + att + ' </span>  ' + o[att],'blue')};ose.log('Legend: <span style=color:yellow>Yellow = Property</span> And <span style=color:blue>Blue = Value</span>')");
                        break;
                    case "prop":
                        eval("var o = " + cmm[1] + ";for (att in o) {d = new String(o[att]).trim();if(d.substr(0,8) == 'function'){d = '[function]'};ose.log('<span style=color:yellow>' + att + ' </span>  ' + d,'blue')};ose.log('Legend: <span style=color:yellow>Yellow = Property</span> And <span style=color:blue>Blue = Value</span>')");
                        break;
                    case "help":
                        ose.log("<div style='width:100%;background-color:#333'><h1 align='center'>Console Help</h1><h2 align='center'>&copy;Kushal Likhi</h2></div>Following Commands Are Available:<br><br>1) <b style=color:yellow>echo &lt;parameter&gt; :</b> <span style=color:blue>Echoes the value of the parameter passed.</span><br>2) <b style=color:yellow>clear :</b> <span style=color:blue>Clears the console screen.</span><br>3) <b style=color:yellow>alias &lt;alias name&gt; &lt;reference&gt; :</b> <span style=color:blue>Creates a shorthand reference to the delegate for easy use. reference can be made to any entity ex.Object, function, string etc. To refer this alias you can type a.&lt;alias name&gt;</span><br>4) <b style=color:yellow>export &lt;variable name&gt; &lt;value&gt; :</b> <span style=color:blue>Exports the variable for future use. reference can be made to any entity ex.Object, function, string etc. To refer this alias you can type e.&lt;variable name&gt;</span><br>5) <b style=color:yellow>prop &lt;object&gt; or prop-f(displays function definition too):</b> <span style=color:blue>List all properties of object.</span><br>6) <b style=color:yellow>edit &lt;function&gt; :</b> <span style=color:blue>Launches editor for editing function.</span><br>7) <b style=color:yellow>size &lt;size&gt; :</b> <span style=color:blue>Changes the console font size.</span><br>8) <b style=color:yellow>help :</b> <span style=color:blue>Launches help.</span><br><br><div style='width:100%;background-color:#333'>End Of Help</div>");
                        break;
                    case "size":
                        document.getElementById("osecta").style.fontSize = cmm[1] + "px";
                        document.getElementById("osecin").style.fontSize = cmm[1] + "px";
                        break;
                    case "yo":
                        ose.log("YO! :-)", "yellow");
                        break;
                    default:
                        eval(scr);
                        break;
                }

            } catch(c) {
                ose.log("Error Executing Command, see manual for details", "red");
            }
        }
        if (e.keyCode == 38) {
            if (ose.osdHandler.currentIndex > 0) {
                document.getElementById("osecin").value = ose.osdHandler.stack[ose.osdHandler.currentIndex - 1];
                ose.osdHandler.currentIndex--;
            }
        }
        if (e.keyCode == 40) {
            if (ose.osdHandler.currentIndex < ose.osdHandler.stack.length) {
                ose.osdHandler.currentIndex++;
                document.getElementById("osecin").value = ose.osdHandler.stack[ose.osdHandler.currentIndex - 1];
            }
        }
    },
    consoleShowHide: function() {
        if (ose.osdHandler.expanded) {
            document.getElementById("ccmdsp").style.display = "none";
            document.getElementById("osecin").style.display = "none";
            document.getElementById("osecta").style.display = "none";
            document.getElementById("osehbc").style.top = "94%";
            ose.osdHandler.expanded = false;
        } else {
            document.getElementById("ccmdsp").style.display = "block";
            document.getElementById("osecin").style.display = "block";
            document.getElementById("osecta").style.display = "block";
            document.getElementById("osehbc").style.top = "60%";
            ose.osdHandler.expanded = true;
        }
    },
    getFunc: function(f) {
        a.evalOSD1234 = "" + f;
    },
    launchEditor: function(delegate, id) {
        var el = document.createElement("div");
        el.style.background = "#fff";
        el.style.position = "fixed";
        el.style.zIndex = 1000;
        el.style.width = "70%";
        el.style.height = "70%";
        el.style.top = "15%";
        el.style.left = "15%";
        el.id = "osedit";
        el.innerHTML = "<textarea id='ostaed' style='width:100%;height:90%;background:#ffc'></textarea><br><button onclick=\"ose.osdHandler.updateFunc('" + id + "')\">Update</button><button onclick='ose.osdHandler.closeEditor()'>Close</button>";
        document.getElementsByTagName("body")[0].appendChild(el);
        var el2 = document.getElementById("ostaed");
        if (!el2) {
            ose.log("not Found")
        }
        el2.innerHTML = el2.innerHTML + delegate;
    },
    updateFunc: function(id) {
        var v = document.getElementById('ostaed').value;
        v = id + " = " + v;
        eval(v);
        ose.osdHandler.closeEditor();
    },
    closeEditor: function() {
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("osedit"));
    },
    init: function() {
        if (ose.settings.osd.console) {
            ose.osdHandler.generateConsole();
        }
        ose.osdHandler.expanded = true;
        ose.osdHandler.stack = new Array();
        ose.osdHandler.currentIndex = ose.osdHandler.stack.length
    }
};
ose.storage = {
    add: function(key, val) {
        localStorage.setItem(key, val);
    },
    fetch: function(key) {
        return localStorage.getItem(key);
    },
    addInQueue: function(val) {
        var queueIndex = parseInt(ose.storage.fetch("queueCount"));
        ose.storage.add("queueItem" + queueIndex, val);
        queueIndex++;
        ose.storage.add("queueCount", queueIndex);
    },
    fetchQueue: function() {
        var queueIndex = parseInt(ose.storage.fetch("queueCount"));
        var arr = new Array();
        for (i = 0; i < queueIndex; i++) {
            arr[i] = ose.storage.fetch("queueItem" + i);
        }
        return arr;
    },
    removeItem: function(key) {
        localStorage.removeItem(key);
    },
    removeQueueItem: function(index) {
        ose.storage.removeItem("queueItem" + index);
    },
    emptyQueue: function() {
        ose.storage.add("queueCount", "0");
    },
    queueSize: function() {
        return parseInt(ose.storage.fetch("queueCount"))
    },
    init: function() {
        ose.storage.add("queueCount", "0");
    }
};
ose.ajax = {
    send: function(method, url, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            }
        };
        xmlhttp.open(method, url, false);
        xmlhttp.send();
    }
};
ose.domain = {
    DataDomain : function(name, id, arr) {
        this.name = name;
        this.id = id;
        this.fields = arr;
        this.getFields = function() {
            return this.fields;
        };
        this.store = ose.domain.storeManager.initializeStore(this);
        this.add = function(record) {
            return ose.domain.storeManager.add(this, record);
        };
        this.remove = function(record) {
            return ose.domain.storeManager.remove(this, record);
        };
        this.removeAll = function() {
            return ose.domain.storeManager.removeAll(this);
        };
        this.update = function(record) {
            return ose.domain.storeManager.update(this);
        };
        this.read = function(sid) {
            return ose.domain.storeManager.read(this);
        };
        this.readAll = function() {
            return ose.domain.storeManager.readAll(this);
        };
        this.getDataJSON = function() {
            return ose.domain.storeManager.getDataJSON(this);
        };
        this.getDeletedDataJSON = function() {
            return ose.domain.storeManager.getDeletedDataJSON(this);
        };
        this.clearDeleted = function() {
            return ose.domain.storeManager.clearDeleted(this);
        };
        this.find = function(model) {
            return ose.domain.storeManager.find(this);
        };
        this.size = function() {
            return ose.domain.storeManager.getCount(this);
        };
        ose.domain.storeManager.enrich(this);
    },
    add: function(arr) {
        ose.domain[arr.id] = new ose.domain.DataDomain(arr.name, arr.id, arr.model);
    }
};
ose.constructor = {
    init_constants: function() {
        ose.info.isPageCached = !(ose.appcache.status == 0);
        ose.info.isOnline = navigator.onLine;
        ose.settings.osd.online = true;
        ose.settings.osd.offline = true;
        var dbm = document.getElementsByName("oseDebug")[0];
        ose.settings.osd.console = (dbm && dbm.getAttribute("content") == "true");
    },
    logConfigSummary: function() {
    },
    init_osd: ose.osdHandler.init,
    init_util: ose.util.init,
    init_events: ose.events.init,
    init_client: ose.client.init,
    init_storage: ose.storage.init,
    init: function() {
        ose.info = {};
        ose.settings = {};
        ose.settings.osd = {};
        ose.eventHandler = {};
        ose.constructor.init_client();
        ose.constructor.init_util();
        ose.constructor.init_constants();
        ose.constructor.init_osd();
        ose.log = ose.osdHandler.console;
        ose.constructor.init_events();
        ose.constructor.init_storage();
        ose.constructor.logConfigSummary();
        for (i = 0; i < ose.loadArr.length; i++) {
            ose.loadArr[i]();
        }
        ose.isLoaded = true;
    }
};
ose.isLoaded = false;
ose.loadArr = [];
ose.ready = function(func) {
    if (ose.isLoaded) {
        func();
    }
    else {
        ose.loadArr.push(func)
    }
};
window.onload = ose.constructor.init;