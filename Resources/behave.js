(function(undefined) {
    "use strict";
    var BehaveHooks = BehaveHooks || function() {
        var hooks = {};
        return {
            add: function(hookName, fn) {
                if ("object" == typeof hookName) {
                    var i;
                    for (i = 0; hookName.length > i; i++) {
                        var theHook = hookName[i];
                        hooks[theHook] || (hooks[theHook] = []);
                        hooks[theHook].push(fn);
                    }
                } else {
                    hooks[hookName] || (hooks[hookName] = []);
                    hooks[hookName].push(fn);
                }
            },
            get: function(hookName) {
                if (hooks[hookName]) return hooks[hookName];
            }
        };
    }(), Behave = Behave || function(userOpts) {
        "function" != typeof String.prototype.repeat && (String.prototype.repeat = function(times) {
            if (1 > times) return "";
            if (times % 2) return this.repeat(times - 1) + this;
            var half = this.repeat(times / 2);
            return half + half;
        });
        "function" != typeof Array.prototype.filter && (Array.prototype.filter = function(func) {
            if (null === this) throw new TypeError();
            var t = Object(this), len = t.length >>> 0;
            if ("function" != typeof func) throw new TypeError();
            var res = [], thisp = arguments[1];
            for (var i = 0; len > i; i++) if (i in t) {
                var val = t[i];
                func.call(thisp, val, i, t) && res.push(val);
            }
            return res;
        });
        var tab, newLine, defaults = {
            textarea: null,
            replaceTab: true,
            softTabs: true,
            tabSize: 4,
            autoOpen: true,
            overwrite: true,
            autoStrip: true,
            autoIndent: true,
            fence: false
        }, charSettings = {
            keyMap: [ {
                open: '"',
                close: '"',
                canBreak: false
            }, {
                open: "'",
                close: "'",
                canBreak: false
            }, {
                open: "(",
                close: ")",
                canBreak: false
            }, {
                open: "[",
                close: "]",
                canBreak: true
            }, {
                open: "{",
                close: "}",
                canBreak: true
            } ]
        }, utils = {
            _callHook: function(hookName, passData) {
                var hooks = BehaveHooks.get(hookName);
                passData = "boolean" == typeof passData && false === passData ? false : true;
                if (hooks) if (passData) {
                    var i, theEditor = defaults.textarea, textVal = theEditor.value, caretPos = utils.cursor.get();
                    for (i = 0; hooks.length > i; i++) hooks[i].call(undefined, {
                        editor: {
                            element: theEditor,
                            text: textVal,
                            levelsDeep: utils.levelsDeep()
                        },
                        caret: {
                            pos: caretPos
                        },
                        lines: {
                            current: utils.cursor.getLine(textVal, caretPos),
                            total: utils.editor.getLines(textVal)
                        }
                    });
                } else for (i = 0; hooks.length > i; i++) hooks[i].call(undefined);
            },
            defineNewLine: function() {
                var ta = document.createElement("textarea");
                ta.value = "\n";
                newLine = 2 == ta.value.length ? "\r\n" : "\n";
            },
            defineTabSize: function(tabSize) {
                if ("undefined" != typeof defaults.textarea.style.OTabSize) {
                    defaults.textarea.style.OTabSize = tabSize;
                    return;
                }
                if ("undefined" != typeof defaults.textarea.style.MozTabSize) {
                    defaults.textarea.style.MozTabSize = tabSize;
                    return;
                }
                if ("undefined" != typeof defaults.textarea.style.tabSize) {
                    defaults.textarea.style.tabSize = tabSize;
                    return;
                }
            },
            cursor: {
                getLine: function(textVal, pos) {
                    return textVal.substring(0, pos).split("\n").length;
                },
                get: function() {
                    if ("number" == typeof document.createElement("textarea").selectionStart) return defaults.textarea.selectionStart;
                    if (document.selection) {
                        var caretPos = 0, range = defaults.textarea.createTextRange(), rangeDupe = document.selection.createRange().duplicate(), rangeDupeBookmark = rangeDupe.getBookmark();
                        range.moveToBookmark(rangeDupeBookmark);
                        while (0 !== range.moveStart("character", -1)) caretPos++;
                        return caretPos;
                    }
                },
                set: function(start, end) {
                    end || (end = start);
                    if (defaults.textarea.setSelectionRange) {
                        defaults.textarea.focus();
                        defaults.textarea.setSelectionRange(start, end);
                    } else if (defaults.textarea.createTextRange) {
                        var range = defaults.textarea.createTextRange();
                        range.collapse(true);
                        range.moveEnd("character", end);
                        range.moveStart("character", start);
                        range.select();
                    }
                },
                selection: function() {
                    var normalizedValue, range, textInputRange, len, endRange, textAreaElement = defaults.textarea, start = 0, end = 0;
                    if ("number" == typeof textAreaElement.selectionStart && "number" == typeof textAreaElement.selectionEnd) {
                        start = textAreaElement.selectionStart;
                        end = textAreaElement.selectionEnd;
                    } else {
                        range = document.selection.createRange();
                        if (range && range.parentElement() == textAreaElement) {
                            normalizedValue = utils.editor.get();
                            len = normalizedValue.length;
                            textInputRange = textAreaElement.createTextRange();
                            textInputRange.moveToBookmark(range.getBookmark());
                            endRange = textAreaElement.createTextRange();
                            endRange.collapse(false);
                            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) start = end = len; else {
                                start = -textInputRange.moveStart("character", -len);
                                start += normalizedValue.slice(0, start).split(newLine).length - 1;
                                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) end = len; else {
                                    end = -textInputRange.moveEnd("character", -len);
                                    end += normalizedValue.slice(0, end).split(newLine).length - 1;
                                }
                            }
                        }
                    }
                    return start == end ? false : {
                        start: start,
                        end: end
                    };
                }
            },
            editor: {
                getLines: function(textVal) {
                    return textVal.split("\n").length;
                },
                get: function() {
                    return defaults.textarea.value.replace(/\r/g, "");
                },
                set: function(data) {
                    defaults.textarea.value = data;
                }
            },
            fenceRange: function() {
                if ("string" == typeof defaults.fence) {
                    var data = utils.editor.get(), pos = utils.cursor.get(), hacked = 0, matchedFence = data.indexOf(defaults.fence), matchCase = 0;
                    while (matchedFence >= 0) {
                        matchCase++;
                        if (matchedFence + hacked > pos) break;
                        hacked += matchedFence + defaults.fence.length;
                        data = data.substring(matchedFence + defaults.fence.length);
                        matchedFence = data.indexOf(defaults.fence);
                    }
                    if (pos > hacked && matchedFence + hacked > pos && 0 === matchCase % 2) return true;
                    return false;
                }
                return true;
            },
            isEven: function(_this, i) {
                return i % 2;
            },
            levelsDeep: function() {
                var pos = utils.cursor.get(), val = utils.editor.get();
                var i, j, left = val.substring(0, pos), levels = 0;
                for (i = 0; left.length > i; i++) for (j = 0; charSettings.keyMap.length > j; j++) if (charSettings.keyMap[j].canBreak) {
                    charSettings.keyMap[j].open == left.charAt(i) && levels++;
                    charSettings.keyMap[j].close == left.charAt(i) && levels--;
                }
                var toDecrement = 0, quoteMap = [ "'", '"' ];
                for (i = 0; charSettings.keyMap.length > i; i++) if (charSettings.keyMap[i].canBreak) for (j in quoteMap) toDecrement += left.split(quoteMap[j]).filter(utils.isEven).join("").split(charSettings.keyMap[i].open).length - 1;
                var finalLevels = levels - toDecrement;
                return finalLevels >= 0 ? finalLevels : 0;
            },
            deepExtend: function(destination, source) {
                for (var property in source) if (source[property] && source[property].constructor && source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    utils.deepExtend(destination[property], source[property]);
                } else destination[property] = source[property];
                return destination;
            },
            addEvent: function(element, eventName, func) {
                element.addEventListener ? element.addEventListener(eventName, func, false) : element.attachEvent && element.attachEvent("on" + eventName, func);
            },
            removeEvent: function(element, eventName, func) {
                element.addEventListener ? element.removeEventListener(eventName, func, false) : element.attachEvent && element.detachEvent("on" + eventName, func);
            },
            preventDefaultEvent: function(e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            }
        }, intercept = {
            tabKey: function(e) {
                if (!utils.fenceRange()) return;
                if (9 == e.keyCode) {
                    utils.preventDefaultEvent(e);
                    var toReturn = true;
                    utils._callHook("tab:before");
                    var selection = utils.cursor.selection(), pos = utils.cursor.get(), val = utils.editor.get();
                    if (selection) {
                        var tempStart = selection.start;
                        while (tempStart--) if ("\n" == val.charAt(tempStart)) {
                            selection.start = tempStart + 1;
                            break;
                        }
                        var i, toIndent = val.substring(selection.start, selection.end), lines = toIndent.split("\n");
                        if (e.shiftKey) {
                            for (i = 0; lines.length > i; i++) lines[i].substring(0, tab.length) == tab && (lines[i] = lines[i].substring(tab.length));
                            toIndent = lines.join("\n");
                            utils.editor.set(val.substring(0, selection.start) + toIndent + val.substring(selection.end));
                            utils.cursor.set(selection.start, selection.start + toIndent.length);
                        } else {
                            for (i in lines) lines[i] = tab + lines[i];
                            toIndent = lines.join("\n");
                            utils.editor.set(val.substring(0, selection.start) + toIndent + val.substring(selection.end));
                            utils.cursor.set(selection.start, selection.start + toIndent.length);
                        }
                    } else {
                        var left = val.substring(0, pos), right = val.substring(pos), edited = left + tab + right;
                        if (e.shiftKey) {
                            if (val.substring(pos - tab.length, pos) == tab) {
                                edited = val.substring(0, pos - tab.length) + right;
                                utils.editor.set(edited);
                                utils.cursor.set(pos - tab.length);
                            }
                        } else {
                            utils.editor.set(edited);
                            utils.cursor.set(pos + tab.length);
                            toReturn = false;
                        }
                    }
                    utils._callHook("tab:after");
                }
                return toReturn;
            },
            enterKey: function(e) {
                if (!utils.fenceRange()) return;
                if (13 == e.keyCode) {
                    utils.preventDefaultEvent(e);
                    utils._callHook("enter:before");
                    var finalCursorPos, i, pos = utils.cursor.get(), val = utils.editor.get(), left = val.substring(0, pos), right = val.substring(pos), leftChar = left.charAt(left.length - 1), rightChar = right.charAt(0), numTabs = utils.levelsDeep(), ourIndent = "", closingBreak = "";
                    if (numTabs) {
                        while (numTabs--) ourIndent += tab;
                        ourIndent = ourIndent;
                        finalCursorPos = ourIndent.length + 1;
                        for (i = 0; charSettings.keyMap.length > i; i++) charSettings.keyMap[i].open == leftChar && charSettings.keyMap[i].close == rightChar && (closingBreak = newLine);
                    } else finalCursorPos = 1;
                    var edited = left + newLine + ourIndent + closingBreak + ourIndent.substring(0, ourIndent.length - tab.length) + right;
                    utils.editor.set(edited);
                    utils.cursor.set(pos + finalCursorPos);
                    utils._callHook("enter:after");
                }
            },
            deleteKey: function(e) {
                if (!utils.fenceRange()) return;
                if (8 == e.keyCode) {
                    utils.preventDefaultEvent(e);
                    utils._callHook("delete:before");
                    var i, pos = utils.cursor.get(), val = utils.editor.get(), left = val.substring(0, pos), right = val.substring(pos), leftChar = left.charAt(left.length - 1), rightChar = right.charAt(0);
                    if (false === utils.cursor.selection()) {
                        for (i = 0; charSettings.keyMap.length > i; i++) if (charSettings.keyMap[i].open == leftChar && charSettings.keyMap[i].close == rightChar) {
                            var edited = val.substring(0, pos - 1) + val.substring(pos + 1);
                            utils.editor.set(edited);
                            utils.cursor.set(pos - 1);
                            return;
                        }
                        var edited = val.substring(0, pos - 1) + val.substring(pos);
                        utils.editor.set(edited);
                        utils.cursor.set(pos - 1);
                    } else {
                        var sel = utils.cursor.selection(), edited = val.substring(0, sel.start) + val.substring(sel.end);
                        utils.editor.set(edited);
                        utils.cursor.set(pos);
                    }
                    utils._callHook("delete:after");
                }
            }
        }, charFuncs = {
            openedChar: function(_char, e) {
                utils.preventDefaultEvent(e);
                utils._callHook("openChar:before");
                var pos = utils.cursor.get(), val = utils.editor.get(), left = val.substring(0, pos), right = val.substring(pos), edited = left + _char.open + _char.close + right;
                defaults.textarea.value = edited;
                utils.cursor.set(pos + 1);
                utils._callHook("openChar:after");
            },
            closedChar: function(_char, e) {
                var pos = utils.cursor.get(), val = utils.editor.get(), toOverwrite = val.substring(pos, pos + 1);
                if (toOverwrite == _char.close) {
                    utils.preventDefaultEvent(e);
                    utils._callHook("closeChar:before");
                    utils.cursor.set(utils.cursor.get() + 1);
                    utils._callHook("closeChar:after");
                    return true;
                }
                return false;
            }
        }, action = {
            filter: function(e) {
                if (!utils.fenceRange()) return;
                var theCode = e.which || e.keyCode;
                if (39 == theCode || 40 == theCode && 0 === e.which) return;
                var i, _char = String.fromCharCode(theCode);
                for (i = 0; charSettings.keyMap.length > i; i++) if (charSettings.keyMap[i].close == _char) {
                    var didClose = defaults.overwrite && charFuncs.closedChar(charSettings.keyMap[i], e);
                    !didClose && charSettings.keyMap[i].open == _char && defaults.autoOpen && charFuncs.openedChar(charSettings.keyMap[i], e);
                } else charSettings.keyMap[i].open == _char && defaults.autoOpen && charFuncs.openedChar(charSettings.keyMap[i], e);
            },
            listen: function() {
                defaults.replaceTab && utils.addEvent(defaults.textarea, "keydown", intercept.tabKey);
                defaults.autoIndent && utils.addEvent(defaults.textarea, "keydown", intercept.enterKey);
                defaults.autoStrip && utils.addEvent(defaults.textarea, "keydown", intercept.deleteKey);
                utils.addEvent(defaults.textarea, "keypress", action.filter);
                utils.addEvent(defaults.textarea, "keydown", function() {
                    utils._callHook("keydown");
                });
                utils.addEvent(defaults.textarea, "keyup", function() {
                    utils._callHook("keyup");
                });
            }
        }, init = function(opts) {
            if (opts.textarea) {
                utils._callHook("init:before", false);
                utils.deepExtend(defaults, opts);
                utils.defineNewLine();
                if (defaults.softTabs) tab = " ".repeat(defaults.tabSize); else {
                    tab = "	";
                    utils.defineTabSize(defaults.tabSize);
                }
                action.listen();
                utils._callHook("init:after", false);
            }
        };
        this.destroy = function() {
            utils.removeEvent(defaults.textarea, "keydown", intercept.tabKey);
            utils.removeEvent(defaults.textarea, "keydown", intercept.enterKey);
            utils.removeEvent(defaults.textarea, "keydown", intercept.deleteKey);
            utils.removeEvent(defaults.textarea, "keypress", action.filter);
        };
        init(userOpts);
    };
    "undefined" != typeof module && module.exports && (module.exports = Behave);
    if ("undefined" == typeof ender) {
        this.Behave = Behave;
        this.BehaveHooks = BehaveHooks;
    }
    "function" == typeof define && define.amd && define("behave", [], function() {
        return Behave;
    });
}).call(this);