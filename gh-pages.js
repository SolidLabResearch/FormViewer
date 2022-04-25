var ghpages = require('gh-pages');

ghpages.publish(
	'public', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'git@github.com:phochste/FormViewer.git', // Update to point to your repository
		user: {
			name: 'Patrick Hochstenbach', // update to use your name
			email: 'patrick.hochstenbach@ugent.be' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);