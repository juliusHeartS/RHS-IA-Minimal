/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

// CSS.
import './welcomeHeader.css';

// Other dependencies.
import { localize } from '../../../../../../nls.js';
import { Button } from '../../../../../../base/browser/ui/positronComponents/button/button.js';
import { usePositronReactServicesContext } from '../../../../../../base/browser/positronReactRendererContext.js';
import { IProductService } from '../../../../../../platform/product/common/productService.js';
import type { GettingStartedActionClassification, GettingStartedActionEvent } from '../../gettingStarted.js';

/**
 * The command the bundled RHS-IA Documentation extension registers to reveal
 * and focus its view in the auxiliary bar.
 */
const OPEN_DOCUMENTATION_COMMAND_ID = 'rhs-ia.documentation.open';

/**
 * WelcomeHeader component. The PAHO and RHS-IA marks, healthcare banner, and a
 * button that opens the bundled documentation.
 * @returns The rendered component.
 */
export const WelcomeHeader = () => {
	const services = usePositronReactServicesContext();
	const productName = services.get(IProductService).nameLong;

	const openHelp = () => {
		services.telemetryService.publicLog2<GettingStartedActionEvent, GettingStartedActionClassification>(
			'gettingStarted.ActionExecuted',
			{
				command: 'welcomeHeaderOpenHelp',
				argument: undefined,
				walkthroughId: undefined,
			});

		services.commandService.executeCommand(OPEN_DOCUMENTATION_COMMAND_ID);
	};

	// Render.
	return (
		<header className='positron-welcome-page-header'>
			{/*
				The page's first heading gives screen readers a stable top level.
				The visible artwork already carries the product identity, so repeating
				the same title beside it would compete with the restored composition.
			*/}
			<h1 className='welcome-header-title'>
				{localize('positron.welcome.title', "Welcome to {0}", productName)}
			</h1>
			<div className='welcome-header-toolbar'>
				<div aria-hidden='true' className='welcome-header-logos'>
					<span className='welcome-header-ops-logo' data-testid='welcome-header-logo' />
					<span className='welcome-header-rhs-logo' data-testid='welcome-header-logo' />
				</div>
				<Button className='welcome-header-help' onPressed={openHelp}>
					<span aria-hidden='true' className='welcome-header-help-icon codicon codicon-question' />
					{localize('positron.welcome.help', "Help")}
				</Button>
			</div>
			<div aria-hidden='true' className='welcome-header-banner' data-testid='welcome-header-banner' />
		</header>
	);
};
