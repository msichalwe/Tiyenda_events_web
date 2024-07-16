import { Designer } from '@grapecity/activereports-react'
import { DesignerProps } from '@grapecity/activereports-react'
import React from 'react'
import '@grapecity/activereports/styles/ar-js-ui.css'
import '@grapecity/activereports/styles/ar-js-designer.css'

// eslint-disable-next-line react/display-name
const DesignerWrapper = (props: DesignerWrapperProps) => {
	const ref = React.useRef<Designer>(null)
	React.useEffect(() => {
		ref.current?.setReport({ id: props.reportUri })
	}, [props.reportUri])
	return <Designer {...props} ref={ref} />
}

export type DesignerWrapperProps = DesignerProps & { reportUri: string }

export default DesignerWrapper
