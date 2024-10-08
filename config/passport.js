/**
 * -------------- PASSPORT CONFIG --------------
 */
const passport = require("passport");
const prisma = require("./client");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new jwtStrategy(opts, async function (jwt_payload, done) {
    // Verify User - find user in database using payload.sub
    const userId = jwt_payload.sub;
    try {
      const user = await prisma.account.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    } catch (error) {
      return done(error, false);
    }
  }),
);
