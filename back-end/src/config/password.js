
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config.js";
import prisma from "../prisma.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let isNewUser = false; // Track if this is a new user
        const email = profile?.emails?.[0]?.value;
        const avatarUrl = profile?.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email is not available"), null);
        }
        
        // Check if user exists with Google ID
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Check if user exists with same email
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Link Google account to existing user
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.id,
                emailVerified: true,
                avatarUrl: user.avatarUrl || avatarUrl,
              },
            });
            isNewUser = false; // Existing user - just linking Google
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                email,
                name: profile.displayName,
                avatarUrl,
                emailVerified: true,
                role: "USER", // Default role for new users
              },
            });
            isNewUser = true; // Newly created user
          }
        }

        // Attach flag to user object for use in googleCallback
        user.isNewUser = isNewUser;
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;