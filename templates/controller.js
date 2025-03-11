const {modelName} = require({modelPath});

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */
module.exports = {

    /**
     * {controllerName}.list()
     */
    list: async function (req, res) {
        try {
            var data = await {modelName}.find();
    return res.json({ data }).status(200);
}
        catch (e) {
    return res.json({ "message": "error", e }).status(200);
}
        // {modelName}.find(function (err, {pluralName}) {
        //     if (err) {
        //         return res.status(500).json({
        //             message: 'Error when getting {name}.',
        //             error: err
        //         });
        //     }

        //     return res.json({pluralName});
        // });
    },

/**
 * {controllerName}.show()
 */
show: async function (req, res) {


    try {
        const name = await {modelName}.findById(req.params.id);
        if (!name) {
            return res.status(404).json({ message: 'No such {name}' });
        }
        return res.json({ name });
    } catch (err) {
        return res.status(500).json({
            message: 'Error when getting {name}.',
            error: err.message
        });
    }
    // { modelName }.findOne({ _id: id }, function (err, { name }) {
    //     if (err) {
    //         return res.status(500).json({
    //             message: 'Error when getting {name}.',
    //             error: err
    //         });
    //     }

    //     if (!{ name }) {
    //         return res.status(404).json({
    //             message: 'No such {name}'
    //         });
    //     }

    //     return res.json({ name });
    // });
},

/**
 * {controllerName}.create()
 */
create: async function (req, res) {
    try {
        const name = new {modelName}({ ...req.body });
        await name.save();
        return res.status(201).json({ name });
    } catch (err) {
        return res.status(500).json({
            message: 'Error when creating {name}',
            error: err.message
        });
    }
    //     const { name } = new { modelName }({{ createFields }
    //         });

    // { name }.save(function (err, { name }) {
    //     if (err) {
    //         return res.status(500).json({
    //             message: 'Error when creating {name}',
    //             error: err
    //         });
    //     }

    //     return res.status(201).json({ name });
    // });
},

/**
 * {controllerName}.update()
 */
update: async function (req, res) {
    try {
        let name = await {modelName}.findById(req.params.id);
        if (!name) {
            return res.status(404).json({ message: 'No such {name}' });
        }
        Object.assign(name, req.body);
        await name.save();
        return res.json({ name });
    } catch (err) {
        return res.status(500).json({
            message: 'Error when updating {name}.',
            error: err.message
        });
    }
},

/**
 * {controllerName}.remove()
 */
remove: async function (req, res) {
    try {
        await {modelName}.findByIdAndDelete(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({
            message: 'Error when deleting the {name}.',
            error: err.message
        });
    }
}
};
