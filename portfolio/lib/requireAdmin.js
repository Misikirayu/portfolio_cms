const { getServerSession } = require("next-auth/next");
const { authOptions } = require("./auth");

/**
 * Wrap an API handler so it 401s unless a valid admin session is present.
 * Usage: export default requireAdmin(async (req, res) => { ... });
 */
function requireAdmin(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    return handler(req, res, session);
  };
}

module.exports = { requireAdmin };
