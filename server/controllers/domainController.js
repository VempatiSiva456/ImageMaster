const Domain = require('../models/Domain');

exports.createDomain = async (req, res) => {
    try {
        const domain = new Domain({ name: req.body.name });
        await domain.save();
        res.status(201).send(domain);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.deleteDomain = async (req, res) => {
    try {
        const domain = await Domain.findByIdAndDelete(req.params.id);
        if (!domain) {
            return res.status(404).send({ error: 'Domain not found' });
        }
        res.send({ message: 'Domain deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
