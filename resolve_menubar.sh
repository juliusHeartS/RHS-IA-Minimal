cat << 'INNER_EOF' > patch.txt
<<<<<<< HEAD
		const state = this.updateService.state;

		switch (state.type) {
			case StateType.Uninitialized:
				return null;

			case StateType.Idle:
				return toAction({
					id: 'update.check', label: localize({ key: 'checkForUpdates', comment: ['&& denotes a mnemonic'] }, "Check for &&Updates..."), enabled: true, run: () =>
						this.updateService.checkForUpdates(true)
				});

			case StateType.CheckingForUpdates:
				return toAction({ id: 'update.checking', label: localize('checkingForUpdates', "Checking for Updates..."), enabled: false, run: () => { } });

			case StateType.AvailableForDownload:
				return toAction({
					id: 'update.downloadNow', label: localize({ key: 'downloadUpdate', comment: ['&& denotes a mnemonic'] }, "D&&ownload Update"), enabled: true, run: () =>
						this.updateService.downloadUpdate()
				});

			case StateType.Downloading:
				return toAction({ id: 'update.downloading', label: localize('DownloadingUpdate', "Downloading Update..."), enabled: false, run: () => { } });

			case StateType.Downloaded:
				return toAction({
					id: 'update.install', label: localize({ key: 'installUpdate', comment: ['&& denotes a mnemonic'] }, "Install &&Update"), enabled: true, run: () =>
						this.updateService.applyUpdate()
				});

			case StateType.Updating:
				return toAction({ id: 'update.updating', label: localize('installingUpdate', "Installing Update..."), enabled: false, run: () => { } });

			case StateType.Ready:
				return toAction({
					id: 'update.restart', label: localize({ key: 'restartToUpdate', comment: ['&& denotes a mnemonic'] }, "Restart to &&Update"), enabled: true, run: () =>
						this.updateService.quitAndInstall()
				});

			default:
				return null;
		}
=======
		return [];
>>>>>>> 1716388a4 (Removed auto-update)
INNER_EOF
