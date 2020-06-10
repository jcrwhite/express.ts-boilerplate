"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hello = (req, res) => {
    return res.status(200).json({ message: 'Hello' });
};
const world = (req, res) => {
    return res.status(200).json({ message: 'Hello' });
};
const greet = (req, res) => {
    return res.status(200).send(`Hello ${req.params.id}!`);
};
const HelloWorld = { hello, world, greet };
exports.default = HelloWorld;
