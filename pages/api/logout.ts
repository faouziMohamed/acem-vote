import nextConnect from 'next-connect';

import type { Request, Response } from '../../lib/lib.types';
import auth from '../../middleware/authentication';

const logoutHandler = nextConnect();

logoutHandler.use(auth).get((req: Request, res: Response) => {
  req.logOut();
  res.end();
});

export default logoutHandler;
