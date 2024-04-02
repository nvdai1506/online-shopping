import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  // console.log(req.headers);
  const accessToken = req.headers['x-access-token'];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, 'nVdai1506');
      // console.log(decoded);
      req.accessTokenPayload = decoded;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        message: 'Invalid accessToken'
      });
    }
  } else {
    return res.status(401).json({
      message: 'AccessToken not found.'
    })
  }
}