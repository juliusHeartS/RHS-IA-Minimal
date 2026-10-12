cat << 'INNER_EOF' > patch.txt
<<<<<<< HEAD
import { ProductContribution, UpdateContribution, CONTEXT_UPDATE_STATE, SwitchProductQualityContribution, showReleaseNotesInEditor, DefaultAccountUpdateContribution } from './update.js';
import { UpdateStatusBarEntryContribution } from './updateStatusBarEntry.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
=======
import { CONTEXT_UPDATE_STATE, RELEASE_NOTES_URL, showReleaseNotesInEditor } from './update.js';
>>>>>>> 1716388a4 (Removed auto-update)
INNER_EOF
