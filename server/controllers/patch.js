import jsonPatch from 'json-patch';
import Joi from 'joi';

export default (req, res) => {
    let body = req.body;
    const schema = Joi.object().keys({
        source: Joi.object().keys({}),
        patch: Joi.object().keys({
            op: Joi.string().required(),
            path: Joi.string().required(),
            value: [Joi.string().optional(), Joi.number().optional()]
        })
    });

    const isValid = Joi.validate(body, schema);
    if (isValid.error) return res.send(400, `Invalid Request. ${isValid.error}`);

    let resultObj = jsonPatch.apply(body.source, [body.patch]);
    if (resultObj instanceof Error) return res.send(500, 'Invalid patch');
    res.status(200).send(resultObj);
}