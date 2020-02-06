/**
 * WordPress dependencies
 */
import { createSlotFill, Panel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import GlobalStylesPanel from './global-styles-panel';

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
	'EditSiteSidebarInspector'
);

function Sidebar() {
	return (
		<div
			className="edit-site-sidebar"
			role="region"
			aria-label={ __( 'Site editor advanced settings.' ) }
			tabIndex="-1"
		>
			<GlobalStylesPanel />
			<Panel header={ __( 'Inspector' ) }>
				<InspectorSlot bubblesVirtually />
			</Panel>
		</div>
	);
}

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
