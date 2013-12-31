function run() {
    var tijasmine = require("../jasmine-2.0.0/Jasmine"), reporter = new (require("../jasmine-2.0.0/console").ConsoleReporter)();
    tijasmine.addSpecModules("spec/ui_spec");
    tijasmine.addReporter(reporter);
    tijasmine.execute();
}

exports.run = run;