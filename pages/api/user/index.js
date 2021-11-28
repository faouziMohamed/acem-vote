import nextConnect from 'next-connect';

import auth from '../../../middleware/authentication';

const handler = nextConnect();

handler.use(auth).get((req, res) => {
  try {
    if (!req.user) return res.json({ user: false });
    const { user } = req;
    return res.json({ user });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message);
    return res.status(500).json({ error: 'Un problème viens de survenir' });
  }
});

export default handler;
