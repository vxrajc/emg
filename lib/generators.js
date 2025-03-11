/**
 * Module dependencies
 */
const ft = require('./fileTools');
const formatTools = require('./formatTools');
const os = require('os');
const fs = require("fs");
const async = require('async');
const path = require("path");
const { execSync } = require("child_process");
const { log } = require('console');
function initGenerator(pathx) {
    try {
        console.log(`Initializing npm in path: ${pathx}`);

        // Initialize npm
        execSync("npm init -y", { stdio: "ignore" });
        console.log("✅ npm initialized successfully.");

        // Install Express.js
        execSync("npm install express", { stdio: "ignore" });
        console.log("✅ Express installed successfully.");
        execSync("npm install mongoose", { stdio: "ignore" });
        console.log("✅ Mongoose installed successfully.");
        // Install bcrypt.js
        execSync("npm install bcryptjs", { stdio: "ignore" });
        console.log("✅ bcryptjs installed successfully.");

        execSync("npm i jsonwebtoken", { stdio: "ignore" });
        console.log("✅ JWT Token installed successfully.");
        // Copy Index js


        const sourceFile = path.resolve(__dirname, "../init/index.js"); // Ensure this path is correct
        const destinationFile = path.resolve(pathx, "index.js");

        console.log("Checking file existence:", sourceFile);
        fs.copyFile(sourceFile, destinationFile, (copyErr) => {
            console.log(copyErr);

            if (copyErr) {
                console.error("❌ Error copying file:", copyErr);
            } else {
                console.log("✅ File copied successfully to:", destinationFile);
                console.log("✅ Created index.js");
            }
        });
        console.log("✅ Created index.js");
        generateAuth(pathx)


        console.log("✅ Created auth routes");

        insertToIndexjs(destinationFile, "app.use('/api/auth',authRoutes)");


        addImportToFile(destinationFile, "const authRoutes = require('./routes/authRoutes')")



    } catch (error) {
        console.error("❌ Error during setup:", error.message);
    }
}

function insertToIndexjs(filePath, newContent) {

    try {
        var data = fs.readFileSync(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
        });
        // console.log(data);
        if (data != null) {
            const listenRegex = /(app\.listen\s*\([^)]*\)\s*=>\s*{[\s\S]*?})/;

            // Check if the pattern exists
            const match = data.match(listenRegex);


            if (!match) {
                console.error("app.listen(...) block not found in the file.");
                return;
            }

            // Insert new content before the matched block
            const updatedContent = data.replace(listenRegex, `${newContent}\n\n${match[0]}`);

            // Write the updated content back to the file
            fs.writeFileSync(filePath, updatedContent, "utf8", (err) => {
                if (err) {
                    console.error("Error writing file:", err);
                } else {
                    console.log("Content inserted successfully.");
                }
            });
        }


    } catch (err) {
        console.error("Error:", err);
    }
}



function addImportToFile(filePath, importStatement) {
    try {
        // Read the existing content
        const existingContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';

        // Combine new content with existing content
        const updatedContent = importStatement + '\n' + existingContent;

        // Write the updated content back to the file
        fs.writeFileSync(filePath, updatedContent, 'utf8');

        console.log('Content prepended successfully.');
    } catch (error) {
        console.error('Error prepending content:', error);
    }
}
function generateAuth(pathx) {
    var auth_data = [
        {
            "dir": "controllers",
            "source": path.resolve(__dirname, "../auth/controller.js"),
            "destination": path.join(pathx, "controllers"),
            "destionationFile": path.join(path.join(pathx, "controllers"), "authController.js")
        },
        {
            "dir": "models",
            "source": path.resolve(__dirname, "../auth/model.js"),
            "destination": path.join(pathx, "models"),
            "destionationFile": path.join(path.join(pathx, "models"), "authModel.js")


        }, {
            "dir": "routes",
            "source": path.resolve(__dirname, "../auth/routes.js"),
            "destination": path.join(pathx, "routes"),
            "destionationFile": path.join(path.join(pathx, "routes"), "authRoutes.js")


        }
    ]


    auth_data.forEach((e) => {
        const sourceFile = e.source // Correct path resolution
        const destinationFile = e.destionationFile// Full destination path

        fs.access(sourceFile, fs.constants.F_OK, (err) => {
            if (err) {
                console.error("File does not exist.");
                return;
            }

        })
        ft.createDirIfIsNotDefined(pathx, e.dir, function () {
            fs.copyFile(sourceFile, destinationFile, (copyErr) => {
                if (copyErr) {
                    console.error("Error copying file:", copyErr);
                } else {
                    console.log("File copied successfully to:", destinationFile);
                }
            });


        })
        insertToIndexjs(pathx+"/index.js", "app.use('/api/auth',authRoutes)");


        addImportToFile(pathx+"/index.js", "const authRoutes = require('./routes/authRoutes')")

    })
}


/**
 * Generate a Mongoose model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {boolean} ts generating code in TS
 * @param {function} cb
 */
function generateModel(path, modelName, modelFields, generateMethod, ts, cb) {
    const fields = formatTools.getFieldsForModelTemplate(modelFields);
    const schemaName = modelName + 'Schema';

    const extension = (ts) ? 'ts' : 'js';
    let model = ft.loadTemplateSync('model.' + extension);
    model = model.replace(/{modelName}/, modelName);
    model = model.replace(/{schemaName}/g, schemaName);
    model = model.replace(/{fields}/, fields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'models', function () {
            ft.writeFile(path + '/models/' + modelName + 'Model.' + extension, model, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Model.' + extension, model, null, cb);
        });
    }
}

/**
 * Generate a Express router
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {boolean} ts generating code in TS
 * @param {function} cb
 */
function generateRouter(path, modelName, generateMethod, ts, cb) {
    const extension = (ts) ? 'ts' : 'js';
    let router = ft.loadTemplateSync('router.' + extension);
    router = router.replace(/{controllerName}/g, modelName + 'Controller');

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'routes', function () {
            router = router.replace(/{controllerPath}/g, '\'../controllers/' + modelName + 'Controller' + ((ts) ? '' : '.' + extension) + '\'');
            ft.writeFile(path + '/routes/' + modelName + 'Routes.' + extension, router, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            router = router.replace(/{controllerPath}/g, '\'./' + modelName + 'Controller' + ((ts) ? '' : '.' + extension) + '\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Routes.' + extension, router, null, cb);
        });
    }

    insertToIndexjs(path+"/index.js", `app.use('/api/${modelName}',${modelName}Routes)`);
    addImportToFile(path+"/index.js", `const ${modelName}Routes = require('./routes/${modelName}Routes')`)

}

/**
 * Generate Controller
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {boolean} ts generating code in TS
 * @param {function} cb
 */
function generateController(path, modelName, modelFields, generateMethod, ts, cb) {
    const extension = (ts) ? 'ts' : 'js';
    let controller = ft.loadTemplateSync('controller.' + extension);

    let updateFields = '';
    let createFields = os.EOL;

    modelFields.forEach(function (f, index, fields) {
        const field = f.name;

        updateFields += modelName + '.' + field + ' = req.body.' + field + ' ? req.body.' + field + ' : ' +
            modelName + '.' + field + ';';
        updateFields += os.EOL + '\t\t\t';

        createFields += '\t\t\t' + field + ' : req.body.' + field;
        createFields += ((fields.length - 1) > index) ? ',' + os.EOL : '';
    });

    controller = controller.replace(/{modelName}/g, formatTools.capitalizeFirstLetter(modelName) + 'Model');
    controller = controller.replace(/{name}/g, modelName);
    controller = controller.replace(/{pluralName}/g, formatTools.pluralize(modelName));
    controller = controller.replace(/{controllerName}/g, modelName + 'Controller');
    controller = controller.replace(/{createFields}/g, createFields);
    controller = controller.replace(/{updateFields}/g, updateFields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'controllers', function () {
            controller = controller.replace(/{modelPath}/g, '\'../models/' + modelName + 'Model' + ((ts) ? '' : '.' + extension) + '\'');
            ft.writeFile(path + '/controllers/' + modelName + 'Controller.' + extension, controller, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            controller = controller.replace(/{modelPath}/g, '\'./' + modelName + 'Model' + ((ts) ? '' : '.' + extension) + '\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Controller.' + extension, controller, null, cb);
        });
    }
}

module.exports = {
    generateModel: generateModel,
    init: initGenerator,
    generateAuths: generateAuth,
    generateRouter: generateRouter,
    generateController: generateController
};
