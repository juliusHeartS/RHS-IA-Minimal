cat << 'INNER_EOF' > patch.txt
<<<<<<< HEAD
&nbsp;

{action-link}

&nbsp;
=======
		// Show a link to enable the assistant if it's not yet enabled
		if (!this.configurationService.getValue('positron.assistant.enable')) {
			welcomeTitle = localize('positronAssistant.comingSoonTitle', "Welcome to Positron Assistant");
			const enableAssistantMessage = localize('positronAssistant.enableAssistantMessage', "Enable Positron Assistant");
			welcomeText = localize('positronAssistant.comingSoonMessage', "Positron Assistant is under development and is currently available as a preview feature of Positron.\n");
			welcomeText += `\n\n[${enableAssistantMessage}](command:positron-assistant.enableAssistantSetting)`;
		} else if (!this.languageModelsService.currentProvider) {
			// No provider is configured/authenticated - show appropriate setup message
			const hasEnabledProviders = this.positronAssistantConfigurationService.getEnabledProviders().length > 0;
			welcomeTitle = localize('positronAssistant.gettingStartedTitle', "Set Up RHS AI Assistant");

			if (hasEnabledProviders) {
				// Providers are enabled but user needs to sign in
				const signInMessage = localize('positronAssistant.signInMessage', "Sign in to a provider");
				welcomeText = localize('positronAssistant.signInSetupMessage', "To start using RHS AI Assistant, sign in to a provider.");
				welcomeText += `\n\n[${signInMessage}](command:positron-assistant.configureProviders)`;
			} else {
				// No providers enabled - need to enable first
				const enableProviderMessage = localize('positronAssistant.enableProviderMessage', "Enable a provider");
				welcomeText = localize('positronAssistant.enableSetupMessage', "To start using RHS AI Assistant, enable a provider in Settings.");
				welcomeText += `\n\n[${enableProviderMessage}](command:workbench.action.openSettings?%22positron.assistant.provider%20enable%22)`;
			}
		} else {
			const guideLinkMessage = localize('positronAssistant.guideLinkMessage', "RHS AI Assistant User Guide");
			welcomeTitle = localize('positronAssistant.welcomeMessageTitle', "Welcome to RHS AI Assistant");
			// eslint-disable-next-line local/code-no-unexternalized-strings
			welcomeText = localize('positronAssistant.welcomeMessageReady', `RHS AI Assistant is an AI coding companion designed to accelerate and enhance your data science projects.

The {guide-link} explains the possibilities and capabilities of RHS AI Assistant.
>>>>>>> 47eafec0c (Added RHS IA branding)
INNER_EOF
