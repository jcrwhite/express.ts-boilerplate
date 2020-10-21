const hello = (req, res) => {
  return res.status(200).json({ message: 'Hello' });
};

const world = (req, res) => {
  return res.status(200).json({ message: 'World' });
};

const greet = (req, res) => {
  return res.status(200).send(`Hello ${req.params.id}!`);
};

export const HelloWorld = { hello, world, greet };
