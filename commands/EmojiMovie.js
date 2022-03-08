const { SlashCommandBuilder } = require('@discordjs/builders');
const { openAi_key } = require('../config.json');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({ apiKey: openAi_key, });
const OpenAi = new OpenAIApi(configuration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojimovie')
		.setDescription('Turn a movie title into emojis!')
		.addStringOption(option =>
			option.setName('movie')
				.setDescription('The movie title to turn into emoji')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('engine')
				.setDescription('What engine to use for text generation')
				.setRequired(false)
				.addChoice('Davinchi', 'text-davinchi-001')
				.addChoice('Curie', 'text-curie-001')
				.addChoice('Babbage', 'text-babbage-001')
				.addChoice('Ada', 'text-ada-001'))
		.addNumberOption(option =>
			option.setName('temperature')
				.setDescription('How predictable the emojis should be')
				.setRequired(false)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const movie = interaction.options.getString('movie', true);

		let engine = interaction.options.getString('engine', false);
		if(engine == null) { engine = 'text-babbage-001'; }

		let Temperature = interaction.options.getNumber('temperature', false);
		if(Temperature == null) { Temperature = 0.2; }

		var prompt = 'Convert movie titles into emoji.\n';
		prompt += '\nBack to the Future: 👨👴🚗🕒 ';
		prompt += '\nBatman: 🤵🦇 ';
		prompt += '\nTransformers: 🚗🤖 ';
		prompt += '\nStar Wars: 💥🌟 ';
		prompt += '\n' + movie;

		const response = await OpenAi.createCompletion(engine, {
			prompt: prompt,
			temperature: Temperature,
			max_tokens: 60,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
			stop: ["\n"],
		  });

		// console.log(response.data.choices);
		await interaction.reply(movie + " " + response.data.choices[0].text);
	},
};