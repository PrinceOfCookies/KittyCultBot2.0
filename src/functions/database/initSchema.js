module.exports = async (client) => {
	if (!client.sql || typeof client.sql.query !== "function") {
		return;
	}

	// KittyCultBot currently has no persisted state requirements under the host.
	// Keep this hook as the schema bootstrap point for future SQL-backed features.
};
