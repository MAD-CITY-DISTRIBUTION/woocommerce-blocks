/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import Button from '@woocommerce/base-components/button';
import { CHECKOUT_URL } from '@woocommerce/block-settings';
import { useCheckoutContext } from '@woocommerce/base-context';
import { usePositionRelativeToViewport } from '@woocommerce/base-hooks';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Checkout button rendered in the full cart page.
 *
 * @param {Object} props Incoming props for the component.
 * @param {string} props.link What the button is linked to.
 */
const CheckoutButton = ( { link }: { link: string } ): JSX.Element => {
	const { isCalculating } = useCheckoutContext();
	const [
		positionReferenceElement,
		positionRelativeToViewport,
	] = usePositionRelativeToViewport();
	const [ showSpinner, setShowSpinner ] = useState( false );

	useEffect( () => {
		// Add a listener to remove the spinner on the checkout button, so the saved page snapshot does not
		// contain the spinner class. See https://archive.is/lOEW0 for why this is needed for Safari.

		if (
			typeof global.addEventListener !== 'function' ||
			typeof global.removeEventListener !== 'function'
		) {
			return;
		}

		const hideSpinner = () => {
			setShowSpinner( false );
		};

		global.addEventListener( 'pageshow', hideSpinner );

		return () => {
			global.removeEventListener( 'pageshow', hideSpinner );
		};
	}, [] );

	const submitContainerContents = (
		<Button
			className="wc-block-cart__submit-button"
			href={ link || CHECKOUT_URL }
			disabled={ isCalculating }
			onClick={ () => setShowSpinner( true ) }
			showSpinner={ showSpinner }
		>
			{ __( 'Proceed to Checkout', 'woo-gutenberg-products-block' ) }
		</Button>
	);

	return (
		<div className="wc-block-cart__submit">
			{ positionReferenceElement }
			{ /* The non-sticky container must always be visible because it gives height to its parent, which is required to calculate when it becomes visible in the viewport. */ }
			<div className="wc-block-cart__submit-container">
				{ submitContainerContents }
			</div>
			{ /* If the positionReferenceElement is below the viewport, display the sticky container. */ }
			{ positionRelativeToViewport === 'below' && (
				<div className="wc-block-cart__submit-container wc-block-cart__submit-container--sticky">
					{ submitContainerContents }
				</div>
			) }
		</div>
	);
};

export default CheckoutButton;