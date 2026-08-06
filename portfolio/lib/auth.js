const CredentialsProvider = require("next-auth/providers/credentials").default;
const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");
const { db, schema } = require("./db");

const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, credentials.email.toLowerCase().trim()))
          .limit(1);

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: String(user.id), email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

module.exports = { authOptions };
