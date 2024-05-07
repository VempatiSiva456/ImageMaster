const Class = require('../models/Class');
const Domain = require('../models/Domain');

exports.createClass = async (req, res) => {
    const { name, domainName } = req.body;

    try {
        let domain = await Domain.findOne({ name: domainName });
        if (!domain) {
            domain = new Domain({ name: domainName });
            await domain.save();
        }

        const newClass = new Class({ name, domain: domain._id });
        await newClass.save();
        res.status(201).send({ newClass, domain });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.status(404).send({ error: 'Class not found' });
        }
        res.send({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
