/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference types="vitest/globals" />

import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { createTestContainer } from '../../../../../test/vitest/positronTestContainer.js';
import { setupRTLRenderer } from '../../../../../test/vitest/reactTestingLibrary.js';
import { WelcomeHeader } from '../../browser/positronWelcomePage/components/welcomeHeader.js';

describe('WelcomeHeader', () => {
	const executeCommand = vi.fn();
	const publicLog2 = vi.fn();

	const ctx = createTestContainer()
		.withReactServices()
		.stub(ICommandService, { executeCommand })
		.stub(ITelemetryService, { publicLog2 })
		// A build-variant name, so a hardcoded product name would fail this.
		.stub(IProductService, { nameLong: 'RHS-IA Test' })
		.build();
	const rtl = setupRTLRenderer(() => ctx.reactServices);

	it('greets with the product name, and gives the page its top heading', () => {
		rtl.render(<WelcomeHeader />);

		expect(screen.getByRole('heading', { level: 1, name: 'Welcome to RHS-IA Test' })).toBeInTheDocument();
	});

	it('renders the restored branding and healthcare banner', () => {
		rtl.render(<WelcomeHeader />);

		expect(screen.getAllByTestId('welcome-header-logo')).toHaveLength(2);
		expect(screen.getByTestId('welcome-header-banner')).toBeInTheDocument();
	});

	it('opens the bundled RHS-IA Documentation view and logs the press', async () => {
		const user = userEvent.setup();
		rtl.render(<WelcomeHeader />);

		await user.click(screen.getByRole('button', { name: 'Help' }));

		expect(executeCommand).toHaveBeenCalledWith('rhs-ia.documentation.open');
		expect(publicLog2).toHaveBeenCalledWith('gettingStarted.ActionExecuted', {
			command: 'welcomeHeaderOpenHelp',
			argument: undefined,
			walkthroughId: undefined,
		});
	});
});
