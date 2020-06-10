const hello = (req, res) => {
  return res.status(200).json({ message: 'Hello' });
};

const world = (req, res) => {
  return res.status(200).json({ message: 'Hello' });
};

const HelloWorld = { hello, world };

export default HelloWorld;
