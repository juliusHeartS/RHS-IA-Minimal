cat << 'INNER_EOF' > patch.txt
<<<<<<< HEAD
		const welcomeTitle = localize('positronAssistant.welcomeTitle', "Welcome to RHS IA Assistant");
		const guideLinkMessage = localize('positronAssistant.guideLinkMessage', "RHS AI Assistant User Guide");
		const learnMoreLinkMessage = localize('positronAssistant.learnMoreLinkMessage', "our documentation");
		
		// eslint-disable-next-line local/code-no-unexternalized-strings
		let welcomeText = localize('positronAssistant.welcomeMessageReady', `RHS IA Assistant is an AI coding companion designed to accelerate and enhance your data science projects.

The {guide-link} explains the possibilities and capabilities of RHS AI Assistant.
=======
...
INNER_EOF
