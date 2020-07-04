var fs = require("fs-extra");
var path = require("path");

var handlebars = require("handlebars");
var showdown = require("showdown");
const converter = new showdown.Converter();

// console.log("starting build...");

handlebars.registerHelper("ifEq", function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

const srcFolder = "./src/posts";

let data = {};
data.entries = [];
fs.readdirSync(srcFolder).forEach((file) => {
    // console.log(file);
    let ext = path.extname(file);
    if (ext == ".md" || ext == ".markdown" || ext == ".txt") {
        let content = fs.readFileSync(srcFolder + "/" + file, "utf8");
        data.entries.push(content);
    }
});

data.entries = data.entries.reverse();

// preprocess markdown
var i = 0;
data.entries.forEach(function(item) {
    data.entries[i] = {};
    data.entries[i].body = converter.makeHtml(item);
    i++;
});

// console.log(JSON.stringify(data));

// write the data as a json file (could be handy for SPA)
fs.writeFileSync("./public/data.json", JSON.stringify(data), "utf8");

// compile
compile(data, "blog.html", "index.html");

function compile(mydata, src, dest) {
    var template = fs.readFileSync("./src/templates/" + src, "utf8");
    var pageBuilder = handlebars.compile(template);
    var pageText = pageBuilder(mydata);
    fs.writeFileSync("./public/" + dest, pageText, "utf8");
}

// console.log("build finished.");
