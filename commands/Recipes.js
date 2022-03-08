const { SlashCommandBuilder } = require('@discordjs/builders');
const { openAi_key } = require('../config.json');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({ apiKey: openAi_key, });
const OpenAi = new OpenAIApi(configuration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('recipe')
		.setDescription('Create a recipe from a list of ingredients.\nEat at your own risk')
		.addStringOption(option =>
			option.setName('recipe')
				.setDescription('What do we want the recipe to be called?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('ingredients')
				.setDescription('What ingredients do we have to work with? (comma separated list)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('engine')
				.setDescription('What engine to use for text generation')
				.setRequired(false)
				.addChoice('Davinchi', 'text-davinchi-001')
				.addChoice('Curie', 'text-curie-001')
				.addChoice('Babbage', 'text-babbage-001')
				.addChoice('Ada', 'text-ada-001')),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const recipe = interaction.options.getString('recipe', true);

		const ingredientsCSV = interaction.options.getString('ingredients', true);
		const ingredients = ingredientsCSV.split(",");

		let engine = interaction.options.getString('engine', false);
		if(engine == null) { engine = 'text-babbage-001'; }

		let Temperature = 0.5;

		var prompt = 'Write a recipe based on these ingredients and instructions:\n';
		prompt += '\n' + recipe + '\n';

		for (i = 0; i < ingredients.length; i++) {
			prompt += '\n' + ingredients[i];
		}

		prompt += '\n\nInstructions:';

		const response = await OpenAi.createCompletion(engine, {
			prompt: prompt,
			temperature: Temperature,
			max_tokens: 120,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
		  });

		// console.log(response.data.choices);
		await interaction.reply(movie + " " + response.data.choices[0].text);
	},
};