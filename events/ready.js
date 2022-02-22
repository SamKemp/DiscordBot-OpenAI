module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('Logged in as ' + client.user.tag + '!');
		client.user.setPresence({ activities: [{ type: 'STREAMING', name: 'Various Songs' }], status: 'online' });
	},
};